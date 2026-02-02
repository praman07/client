/**
 * CONNECTION MANAGER: Core WebSocket lifecycle management
 *
 * Responsibility:
 * - Establish/tear down WebSocket connections
 * - Handle connection state transitions
 * - Process incoming/outgoing messages
 * - Dispatch received events to router
 *
 * Does NOT handle:
 * - Reconnection logic (see reconnection-strategy.ts)
 * - Message queuing (see message-queue.ts)
 * - Heartbeat (see heartbeat.ts)
 */

import { eventRouter } from '../event-router'
import type { ClientMessage, ServerMessage } from '../protocol/core-protocol'
import { env } from '@/shared/config/env'

export type InternalState =
  | 'IDLE' // Not connected, no intent to connect
  | 'CONNECTING' // Socket creation initiated
  | 'CONNECTED' // Socket open and ready
  | 'RECONNECTING' // Waiting for backoff timer
  | 'OFFLINE' // Max attempts or auth failure

export type ConnectionStatus =
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'RECONNECTING'
  | 'OFFLINE'

type ConnectionCallbacks = {
  onStateChange: (state: InternalState) => void
  onAuthError: () => void
}

type ConnectionState = {
  socket: WebSocket | null
  state: InternalState
  token: string | null
  workspaceId: string | null
}

const state: ConnectionState = {
  socket: null,
  state: 'IDLE',
  token: null,
  workspaceId: null,
}

let callbacks: ConnectionCallbacks | null = null

/**
 * Sets up connection manager with callbacks.
 */
export function setupCallbacks(cbs: ConnectionCallbacks): void {
  callbacks = cbs
}

/**
 * Maps internal state to public connection status.
 */
export function getPublicStatus(
  internalState: InternalState,
): ConnectionStatus {
  switch (internalState) {
    case 'CONNECTED':
      return 'CONNECTED'
    case 'RECONNECTING':
      return 'RECONNECTING'
    case 'OFFLINE':
      return 'OFFLINE'
    case 'IDLE':
    case 'CONNECTING':
    default:
      return 'DISCONNECTED'
  }
}

/**
 * Updates internal state and notifies listeners.
 */
function setState(newState: InternalState): void {
  state.state = newState
  callbacks?.onStateChange(newState)
}

/**
 * Validates server message structure.
 */
function isValidServerMessage(data: unknown): data is ServerMessage {
  if (typeof data !== 'object' || data === null) return false

  const { type } = data as Record<string, unknown>
  // Basic validation - just check if type is a string
  return typeof type === 'string'
}

/**
 * Handles incoming WebSocket messages.
 */
function handleMessage(event: MessageEvent): void {
  try {
    const data = JSON.parse(event.data)
    if (isValidServerMessage(data)) {
      eventRouter.dispatch(data as any)
    } else {
      console.warn('[ConnectionManager] Invalid envelope:', data)
    }
  } catch (e) {
    console.error('[ConnectionManager] Parse failure:', event.data)
  }
}

/**
 * Handles WebSocket open event.
 */
export function handleOpen(onConnected: () => void): void {
  if (state.state !== 'CONNECTING') {
    console.warn('[ConnectionManager] Open event but state is:', state.state)
  }

  console.log('[ConnectionManager] Connected')
  setState('CONNECTED')

  // Caller responsibility: flush queue, start heartbeat, re-subscribe
  onConnected()
}

/**
 * Handles WebSocket close event.
 */
export function handleClose(
  event: CloseEvent,
  onScheduleReconnect: () => void,
): void {
  console.log('[ConnectionManager] Closed:', {
    code: event.code,
    reason: event.reason,
    wasClean: event.wasClean,
  })

  state.socket = null

  // Expected close (explicit disconnect)
  if (state.state === 'IDLE' || state.state === 'OFFLINE') {
    return
  }

  // Auth error (close code 4001)
  if (event.code === 4001) {
    console.warn('[ConnectionManager] Auth error detected')
    setState('OFFLINE')
    callbacks?.onAuthError()
    return
  }

  // Unexpected close -> trigger reconnect
  console.log('[ConnectionManager] Unexpected close, scheduling reconnect')
  onScheduleReconnect()
}

/**
 * Establishes WebSocket connection.
 *
 * @param isLeader - Only leader tab should connect
 * @param onOpen - Callback when connection opens
 * @param onClose - Callback when connection closes
 * @returns true if connection initiated, false if blocked
 */
export function establishConnection(
  isLeader: boolean,
  onOpen: () => void,
  onClose: () => void,
): boolean {
  if (!state.token) {
    console.log('[ConnectionManager] Skipping connection (no token yet)')
    return false
  }

  // State guard
  if (state.state === 'CONNECTED' || state.state === 'CONNECTING') {
    return false
  }

  if (!isLeader) {
    console.log('[ConnectionManager] Blocked: not leader')
    return false
  }

  // Build WebSocket URL
  let rawUrl =
    env.VITE_WS_URL ||
    env.VITE_SERVER_URL?.replace('http', 'ws') ||
    'ws://localhost:8080'

  if (rawUrl.startsWith('http')) {
    rawUrl = rawUrl.replace(/^http/, 'ws')
  }

  const url = new URL(rawUrl)

  if (url.port === '3001' && (url.pathname === '/' || url.pathname === '')) {
    url.pathname = '/ws'
  }

  url.searchParams.set('token', state.token)
  if (state.workspaceId) {
    url.searchParams.set('workspaceId', state.workspaceId)
  }

  try {
    console.log('[ConnectionManager] Opening socket to:', url.toString())
    setState('CONNECTING')

    state.socket = new WebSocket(url.toString())
    state.socket.onopen = () => handleOpen(onOpen)
    state.socket.onclose = (event) => handleClose(event, onClose)
    state.socket.onmessage = handleMessage
    state.socket.onerror = (e) =>
      console.error('[ConnectionManager] Socket error:', e)

    return true
  } catch (e) {
    console.error('[ConnectionManager] Exception during creation:', e)
    setState('IDLE')
    onClose() // Trigger reconnect
    return false
  }
}

/**
 * Sends a message through the WebSocket.
 *
 * @returns true if sent, false if queued (socket not ready)
 */
export function sendEnvelope(envelope: Omit<ClientMessage, 'id'>): boolean {
  const fullEnvelope: ClientMessage = {
    ...envelope,
    id: crypto.randomUUID(),
  }

  const msg = JSON.stringify(fullEnvelope)

  if (state.socket?.readyState === WebSocket.OPEN) {
    state.socket.send(msg)
    return true
  }

  return false // Caller should queue
}

/**
 * Updates connection credentials (token + workspace).
 */
export function updateCredentials(token: string, workspaceId: string): void {
  state.token = token
  state.workspaceId = workspaceId
}

/**
 * Closes the WebSocket connection.
 */
export function closeConnection(): void {
  setState('IDLE')

  if (state.socket) {
    state.socket.close()
    state.socket = null
  }
}

/**
 * Returns current connection state.
 */
export function getState(): InternalState {
  return state.state
}

/**
 * Returns whether socket is open.
 */
export function isOpen(): boolean {
  return state.socket?.readyState === WebSocket.OPEN
}
