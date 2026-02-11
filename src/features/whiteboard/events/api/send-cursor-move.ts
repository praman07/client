/**
 * Send Cursor Move - Public API Action
 *
 * Sends cursor position updates to the server via WebSocket
 * Features:
 * - RAF-based throttling (60fps max)
 * - Lightweight (no persistence)
 * - Type-safe pointer type
 *
 * @layer Features
 * @module whiteboard/events/api
 */

import { wsManager } from '@/shared/ws/manager'
import { WhiteboardUpstreamEvent } from '@/shared/contracts/whiteboard/events'
import type { CursorMovePayload } from '@/shared/contracts/whiteboard/upstream'

// Throttle state per board
const throttleState = new Map<
  string,
  {
    rafId: number | null
    pendingCursor: { x: number; y: number; pointer: string } | null
  }
>()

/**
 * Send cursor position to the server (throttled to 60fps)
 *
 * @param boardId - The board ID
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param pointer - Pointer type ('mouse' | 'touch' | 'pen')
 *
 * @example
 * ```ts
 * import { sendCursorMove } from '@/features/whiteboard/events'
 *
 * canvas.addEventListener('pointermove', (e) => {
 *   sendCursorMove(boardId, e.clientX, e.clientY, e.pointerType)
 * })
 * ```
 */
export function sendCursorMove(
  boardId: string,
  x: number,
  y: number,
  pointer: 'mouse' | 'touch' | 'pen' = 'mouse',
): void {
  // Get or create throttle state for this board
  let state = throttleState.get(boardId)
  if (!state) {
    state = { rafId: null, pendingCursor: null }
    throttleState.set(boardId, state)
  }

  // Store the latest cursor position
  state.pendingCursor = { x, y, pointer }

  // If RAF is already scheduled, do nothing (throttled)
  if (state.rafId !== null) {
    return
  }

  // Schedule sending on next animation frame
  state.rafId = requestAnimationFrame(() => {
    const cursor = state!.pendingCursor
    if (!cursor) {
      state!.rafId = null
      return
    }

    // Prepare payload (pointer is tracked locally, not sent)
    const payload: CursorMovePayload = {
      boardId,
      x: cursor.x,
      y: cursor.y,
    }

    // Send via WebSocket (wsManager.emit is the correct API, skip logging to avoid spam)
    wsManager.emit(WhiteboardUpstreamEvent.CursorMove, payload)

    // Reset state
    state!.rafId = null
    state!.pendingCursor = null
  })
}

/**
 * Clear cursor throttle state for a board (call on unmount)
 *
 * @param boardId - The board ID
 */
export function clearCursorThrottle(boardId: string): void {
  const state = throttleState.get(boardId)
  if (state?.rafId) {
    cancelAnimationFrame(state.rafId)
  }
  throttleState.delete(boardId)
}
