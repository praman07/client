import { useEffect } from 'react'
import { subscribeBoard, unsubscribeBoard } from '@/features/whiteboard/events'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:use-subscribe')

/**
 * Auto-subscribe to whiteboard board on mount
 *
 * Automatically subscribes when component mounts and unsubscribes on unmount.
 * Server will send board-init event with snapshot and collaborators.
 *
 * @param boardId - Board ID to subscribe to
 * @param enabled - Whether subscription is enabled (default: true)
 *
 * @example
 * ```tsx
 * function WhiteboardCanvas({ boardId }: { boardId: string }) {
 *   // Auto-subscribe (handles cleanup automatically)
 *   useSubscribeBoard(boardId)
 *
 *   // ... rest of component
 * }
 * ```
 */
export function useSubscribeBoard(boardId: string, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    log.debug('Auto-subscribing to board', { boardId })
    subscribeBoard(boardId)

    return () => {
      log.debug('Auto-unsubscribing from board', { boardId })
      unsubscribeBoard(boardId)
    }
  }, [boardId, enabled])
}
