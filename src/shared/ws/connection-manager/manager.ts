import { env } from '@/shared/config/env'
import { eventRouter } from './event-router'
import {
  ClientMessage,
  ClientEventName,
  ClientEventPayloads,
  ServerEventName,
  ServerMessageUnion,
} from './protocol'

// --- Constants ---
const RECONNECT_INTERVAL_MS = 2000
const MAX_RECONNECT_ATTEMPTS = 5
const HEARTBEAT_INTERVAL_MS = 30000

// --- Factory Function ---

export const createConnectionManager = () => {
  // --- Encapsulated State ---
  let socket: WebSocket | null = null
  let token: string | null = null
  let currentWorkspaceId: string | null = null // New State
  let reconnectAttempts = 0
  let isExplicitlyDisconnected = false
  let pingInterval: ReturnType<typeof setInterval> | null = null
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  const messageQueue: string[] = []
  const activeSubscriptions = new Set<string>()

  // --- Helpers ---

  const clearTimers = () => {
    if (pingInterval) clearInterval(pingInterval)
    if (reconnectTimeout) clearTimeout(reconnectTimeout)
    pingInterval = null
    reconnectTimeout = null
  }

  const sendEnvelope = (envelope: ClientMessage) => {
    const msg = JSON.stringify(envelope)
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(msg)
    } else {
      messageQueue.push(msg)
    }
  }

  const flushQueue = () => {
    while (messageQueue.length > 0) {
      const msg = messageQueue.shift()
      if (msg && socket?.readyState === WebSocket.OPEN) {
        socket.send(msg)
      }
    }
  }

  const startHeartbeat = () => {
    if (pingInterval) clearInterval(pingInterval)
    pingInterval = setInterval(() => {
      manager.emit(ClientEventName.Ping, {})
    }, HEARTBEAT_INTERVAL_MS)
  }

  const scheduleReconnect = () => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('[WS] Max reconnect attempts reached')
      return
    }

    const delay = RECONNECT_INTERVAL_MS * Math.pow(1.5, reconnectAttempts)
    console.log(
      `[WS-Manager] Reconnecting in ${delay}ms... (Attempt ${reconnectAttempts + 1})`,
    )

    reconnectTimeout = setTimeout(() => {
      reconnectAttempts++
      establishConnection()
    }, delay)
  }

  // --- Handlers ---

  const handleOpen = () => {
    console.log('[WS-Manager] Connected (Open Event)')
    reconnectAttempts = 0
    flushQueue()
    startHeartbeat()

    activeSubscriptions.forEach((channelId) => {
      manager.emit(ClientEventName.SubscribeChannel, { channelId })
    })
  }

  const handleClose = (event: CloseEvent) => {
    console.log('[WS-Manager] Socket Closed:', {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
    })
    clearTimers()
    if (!isExplicitlyDisconnected) {
      scheduleReconnect()
    }
  }

  // User-Defined Type Guard
  function isValidServerMessage(data: unknown): data is ServerMessageUnion {
    if (typeof data !== 'object' || data === null) return false

    const { event, payload } = data as Record<string, unknown>
    const isValidEvent = Object.values(ServerEventName).includes(
      event as ServerEventName,
    )

    return isValidEvent && payload !== undefined
  }

  const handleMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      if (isValidServerMessage(data)) {
        console.log('[WS-Manager] Dispatching:', data.event)
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
      console.error('[WS] Cannot connect without token')
      return
    }

    const wsUrl =
      env.VITE_WS_URL ||
      env.VITE_SERVER_URL?.replace('http', 'ws') ||
      'ws://localhost:8080'
    const url = new URL(wsUrl)
    url.searchParams.set('token', token)
    if (currentWorkspaceId) {
      url.searchParams.set('workspaceId', currentWorkspaceId)
    }

    try {
      console.log('[WS-Manager] Opening socket to:', url.toString())
      socket = new WebSocket(url.toString())
      socket.onopen = handleOpen
      socket.onclose = handleClose
      socket.onmessage = handleMessage
      socket.onerror = (e) => console.error('[WS-Manager] Socket Error:', e)
    } catch (e) {
      console.error('[WS-Manager] Exception during creation:', e)
      scheduleReconnect()
    }
  }

  // --- Public Interface ---
  const manager = {
    connect(userToken: string, workspaceId: string) {
      if (socket?.readyState === WebSocket.OPEN) return
      token = userToken
      // We store workspaceId in the URL param during establishment,
      // but we need to pass it to establishConnection or store it in closure state if we want to use it for reconnects.
      // Let's ensure establishConnection uses it.
      // UPDATE: We need to store it in state so reconnect logic works.

      // Let's update the state variables above first.
      currentWorkspaceId = workspaceId

      isExplicitlyDisconnected = false
      reconnectAttempts = 0
      establishConnection()
    },

    disconnect() {
      isExplicitlyDisconnected = true
      activeSubscriptions.clear()
      clearTimers()
      if (socket) {
        socket.close()
        socket = null
      }
    },

    emit<T extends ClientEventName>(event: T, payload: ClientEventPayloads[T]) {
      console.log('[WS-Manager] Emitting:', event)
      sendEnvelope({ event, payload })
    },

    subscribe(channelId: string) {
      if (activeSubscriptions.has(channelId)) return
      activeSubscriptions.add(channelId)
      this.emit(ClientEventName.SubscribeChannel, { channelId })
    },

    unsubscribe(channelId: string) {
      if (!activeSubscriptions.has(channelId)) return
      activeSubscriptions.delete(channelId)
      this.emit(ClientEventName.UnsubscribeChannel, { channelId })
    },

    getStatus() {
      return socket?.readyState
    },
  }

  return manager
}

// Singleton Instance (Default Export)
export const wsManager = createConnectionManager()
