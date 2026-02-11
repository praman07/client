import { useCallback, useEffect } from 'react'
import {
  sendCursorMove as sendCursor,
  clearCursorThrottle,
} from '@/features/whiteboard/events'

/**
 * Hook for sending cursor position updates
 *
 * Returns stable callback + auto-cleanup on unmount
 *
 * @param boardId - Board ID
 * @returns Stable callback function
 *
 * @example
 * ```tsx
 * const sendCursor = useSendCursorMove(boardId)
 *
 * <canvas
 *   onPointerMove={(e) => {
 *     sendCursor(e.clientX, e.clientY, e.pointerType)
 *   }}
 * />
 * ```
 */
export function useSendCursorMove(boardId: string) {
  // Cleanup throttle state on unmount
  useEffect(() => {
    return () => {
      clearCursorThrottle(boardId)
    }
  }, [boardId])

  return useCallback(
    (x: number, y: number, pointer: 'mouse' | 'touch' | 'pen' = 'mouse') => {
      sendCursor(boardId, x, y, pointer)
    },
    [boardId],
  )
}
