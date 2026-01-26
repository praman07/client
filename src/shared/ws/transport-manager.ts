/**
 * TRANSPORT LAYER: STRICT BOUNDARY
 * This file MUST NOT import from:
 * - features/*
 * - entities/* (except generic types)
 * - app/providers/*
 * - widgets/*
 *
 * Responsibility: Manage raw WebSocket connection, heartbeat, and reconnection.
 */
import { eventRouter } from './event-router'
import { leaderElection } from '@/shared/lib/broadcast/leader-election'
import { ClientEventName, ServerEventName } from './protocol'
import type {
  ClientEventPayloads,
  ClientMessage,
  ServerMessageUnion,
} from './protocol'
import { env } from '@/shared/config/env'

// --- Constants ---
const RECONNECT_INTERVAL_MS = 2000
const MAX_RECONNECT_ATTEMPTS = 5
const HEARTBEAT_INTERVAL_MS = 30000
const MAX_QUEUE_SIZE = 50

export type ConnectionStatus =
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'RECONNECTING'
  | 'OFFLINE'

// --- Internal State Definition ---
type InternalState =
  | 'IDLE' // Initial state, explicitly disconnected, or Follower mode
  | 'CONNECTING' // Socket creation initiated, waiting for open
  | 'CONNECTED' // Socket open and ready
  | 'RECONNECTING' // Waiting for backoff timer
  | 'OFFLINE' // Max attempts reached or auth failure

// --- Factory Function ---

export const createConnectionManager = () => {
  // --- Encapsulated State ---
  let internalState: InternalState = 'IDLE'
  let socket: WebSocket | null = null
  let token: string | null = null
  let currentWorkspaceId: string | null = null
  let reconnectAttempts = 0
  let pingInterval: ReturnType<typeof setInterval> | null = null
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  // Buffer for reconnects (max 50)
  const messageQueue: Array<{ msg: string; type: ClientEventName }> = []

  // Intent: what the app WANTS to be subscribed to. Separate from transport state.
  const activeSubscriptions = new Set<string>()

  // Status Listeners
  const statusListeners = new Set<(status: ConnectionStatus) => void>()
  const notifyStatus = (state: InternalState) => {
    // Map Internal State to Public Status
    let publicStatus: ConnectionStatus
    switch (state) {
      case 'CONNECTED':
        publicStatus = 'CONNECTED'
        break
      case 'RECONNECTING':
        publicStatus = 'RECONNECTING'
        break
      case 'OFFLINE':
        publicStatus = 'OFFLINE'
        break
      case 'IDLE':
      case 'CONNECTING':
      default:
        publicStatus = 'DISCONNECTED'
        break
    }
    statusListeners.forEach((cb) => cb(publicStatus))
  }

  // NEW: Leader Election State
  let isLeader = leaderElection.isLeader()

  // --- Helpers ---

  const clearTimers = () => {
    if (pingInterval) clearInterval(pingInterval)
    if (reconnectTimeout) clearTimeout(reconnectTimeout)
    pingInterval = null
    reconnectTimeout = null
  }

  const getMessagePriority = (type: ClientEventName): 'HIGH' | 'LOW' => {
    switch (type) {
      case ClientEventName.SendMessage:
      case ClientEventName.SendThreadMessage:
      case ClientEventName.EditMessage:
      case ClientEventName.DeleteMessage:
        return 'HIGH'
      default:
        return 'LOW'
    }
  }

  const sendEnvelope = (envelope: Omit<ClientMessage, 'id'>) => {
    const fullEnvelope: ClientMessage = {
      ...envelope,
      id: crypto.randomUUID(),
    }
    const msg = JSON.stringify(fullEnvelope)
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(msg)
    } else {
      if (messageQueue.length >= MAX_QUEUE_SIZE) {
        const incomingPriority = getMessagePriority(envelope.type)

        if (incomingPriority === 'HIGH') {
          const lowPriIndex = messageQueue.findIndex(
            (item) => getMessagePriority(item.type) === 'LOW',
          )
          if (lowPriIndex !== -1) {
            messageQueue.splice(lowPriIndex, 1)
            messageQueue.push({ msg, type: envelope.type })
          } else {
            // TODO(Arch): Confirm policy when queue is full of HIGH priority messages. Currently FIFO.
            messageQueue.shift()
            messageQueue.push({ msg, type: envelope.type })
          }
        } else {
          // Incoming is low priority, just drop it
          console.warn(
            '[WS-Manager] Queue full, dropping low-priority message',
            envelope.type,
          )
          return
        }
      } else {
        messageQueue.push({ msg, type: envelope.type })
      }
    }
  }

  const flushQueue = () => {
    while (messageQueue.length > 0) {
      const item = messageQueue.shift()
      if (item && socket?.readyState === WebSocket.OPEN) {
        socket.send(item.msg)
      }
    }
  }

  const startHeartbeat = () => {
    if (pingInterval) clearInterval(pingInterval)
    pingInterval = setInterval(() => {
      // Direct send to avoid closure issues with 'manager' const
      console.log('[WS-Manager] Emitting:', ClientEventName.Ping)
      sendEnvelope({ type: ClientEventName.Ping, payload: {} })
    }, HEARTBEAT_INTERVAL_MS)
  }

  const scheduleReconnect = () => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('[WS] Max reconnect attempts reached')
      internalState = 'OFFLINE'
      notifyStatus('OFFLINE')
      return
    }

    internalState = 'RECONNECTING'

    const delay = RECONNECT_INTERVAL_MS * Math.pow(1.5, reconnectAttempts)
    console.log(
      `[WS-Manager] Reconnecting in ${delay}ms... (Attempt ${reconnectAttempts + 1})`,
    )

    reconnectTimeout = setTimeout(() => {
      reconnectAttempts++
      establishConnection()
      // Note: notifyStatus not needed here, establishConnection transitions to CONNECTING
    }, delay)
  }

  // --- Handlers ---

  const handleOpen = () => {
    if (internalState !== 'CONNECTING') {
      // Race condition or stale event?
      console.warn(
        '[WS-Manager] Socket open event but state is:',
        internalState,
      )
      // We accept it if we were connecting.
    }
    console.log('[WS-Manager] Connected (Open Event)')
    internalState = 'CONNECTED'
    // TODO: Protocol Handshake - Validate server version
    notifyStatus(internalState)
    reconnectAttempts = 0
    flushQueue()
    startHeartbeat()

    activeSubscriptions.forEach((conversationId) => {
      manager.emit(ClientEventName.SubscribeChannel, { conversationId })
    })
  }

  const handleClose = (event: CloseEvent) => {
    console.log('[WS-Manager] Socket Closed:', {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
    })
    clearTimers()
    socket = null

    if (internalState === 'IDLE' || internalState === 'OFFLINE') {
      // This was an expected close (e.g. disconnect() called)
      notifyStatus(internalState)
      return
    }

    // Unexpected close
    console.log('[WS-Manager] Unexpected close -> Scheduling Reconnect')
    notifyStatus(internalState) // Will notify DISCONNECTED/RECONNECTING implicitly via scheduleReconnect?
    // scheduleReconnect sets internalState = 'RECONNECTING'
    scheduleReconnect()
  }

  // User-Defined Type Guard
  function isValidServerMessage(data: unknown): data is ServerMessageUnion {
    if (typeof data !== 'object' || data === null) return false

    const { type } = data as Record<string, unknown>
    const isValidEvent = Object.values(ServerEventName).includes(
      type as ServerEventName,
    )

    return isValidEvent
  }

  const handleMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      if (isValidServerMessage(data)) {
        // TODO: Handle SubscribeAck
        console.log('[WS-Manager] Dispatching:', data.type)
        eventRouter.dispatch(data)
      } else {
        console.warn('[WS-Manager] Invalid Envelope:', data)
      }
    } catch (e) {
      console.error('[WS-Manager] Parse Failure:', event.data)
    }
  }

  const establishConnection = () => {
    if (!token) {
      console.error('[WS-Manager] Cannot connect without token')
      return
    }

    // State Guard: Can only connect from IDLE, RECONNECTING, or OFFLINE
    if (internalState === 'CONNECTED' || internalState === 'CONNECTING') {
      return
    }
    if (!isLeader) {
      console.log('[WS-Manager] Blocking connect: I am a Follower')
      return
    }

    // Resolve URL robustly
    let rawUrl =
      env.VITE_WS_URL ||
      env.VITE_SERVER_URL?.replace('http', 'ws') ||
      'ws://localhost:8080'

    // Force WebSocket protocol if http is provided
    if (rawUrl.startsWith('http')) {
      rawUrl = rawUrl.replace(/^http/, 'ws')
    }

    const url = new URL(rawUrl)

    // Ensure /ws suffix if connecting to backend port 3001 and no path set
    if (url.port === '3001' && (url.pathname === '/' || url.pathname === '')) {
      url.pathname = '/ws'
    }

    url.searchParams.set('token', token)
    if (currentWorkspaceId) {
      url.searchParams.set('workspaceId', currentWorkspaceId)
    }

    try {
      console.log('[WS-Manager] Opening socket to:', url.toString())
      internalState = 'CONNECTING'
      // notifyStatus('CONNECTING') // Maps to DISCONNECTED public status, maybe skip noise?
      socket = new WebSocket(url.toString())
      socket.onopen = handleOpen
      socket.onclose = handleClose
      socket.onmessage = handleMessage
      socket.onerror = (e) => console.error('[WS-Manager] Socket Error:', e)
    } catch (e) {
      console.error('[WS-Manager] Exception during creation:', e)
      internalState = 'IDLE' // Fallback to IDLE on immediate fail? Or Reconnect?
      scheduleReconnect()
    }
  }

  // --- Public Interface ---
  const manager = {
    connect(userToken: string, workspaceId: string) {
      if (socket?.readyState === WebSocket.OPEN) return

      // Update Inputs
      token = userToken
      currentWorkspaceId = workspaceId

      // User Intent: Connect
      // If OFFLINE, we reset attempts.
      if (internalState === 'OFFLINE') {
        reconnectAttempts = 0
      }

      // Establish
      establishConnection()
    },

    disconnect() {
      internalState = 'IDLE' // Explicit IDLE
      activeSubscriptions.clear()
      clearTimers()
      if (socket) {
        socket.close()
        socket = null
      }
      notifyStatus('IDLE')
    },

    emit<T extends ClientEventName>(type: T, payload: ClientEventPayloads[T]) {
      console.log('[WS-Manager] Emitting:', type)
      sendEnvelope({ type, payload })
    },

    subscribe(conversationId: string) {
      if (activeSubscriptions.has(conversationId)) return
      activeSubscriptions.add(conversationId)
      this.emit(ClientEventName.SubscribeChannel, { conversationId })
    },

    unsubscribe(conversationId: string) {
      if (!activeSubscriptions.has(conversationId)) return
      activeSubscriptions.delete(conversationId)
      this.emit(ClientEventName.UnsubscribeChannel, { conversationId })
    },

    getStatus() {
      return socket?.readyState
    },

    onStatusChange(cb: (status: ConnectionStatus) => void) {
      statusListeners.add(cb)
      // Emit current status based on internal state
      if (internalState === 'CONNECTED') cb('CONNECTED')
      else if (internalState === 'RECONNECTING') cb('RECONNECTING')
      else if (internalState === 'OFFLINE') cb('OFFLINE')
      else cb('DISCONNECTED')
      return () => statusListeners.delete(cb)
    },
  }

  leaderElection.subscribe((state) => {
    const wasLeader = isLeader
    isLeader = state === 'LEADER'

    console.log('[WS-Manager] Leader State Changed:', state)

    if (isLeader && !wasLeader) {
      if (token && currentWorkspaceId) {
        console.log('[WS-Manager] Promoted to Leader -> Connecting')
        establishConnection()
      }
    } else if (!isLeader && wasLeader) {
      // Demoted!
      console.log('[WS-Manager] Demoted to Follower -> Force IDLE')
      internalState = 'IDLE'
      if (socket) {
        socket.close()
        socket = null
      }
      clearTimers()
      notifyStatus('IDLE')
    }
  })

  return manager
}

// Singleton Instance (Default Export)
export const wsManager = createConnectionManager()
