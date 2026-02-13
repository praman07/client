import { useActiveCollaborators } from '@/entities/whiteboard-presence'
import { useSendCursorMove } from '@/features/whiteboard/send-cursor-move'
import { getCursorColor } from '../lib/cursor-renderer'

export interface RemoteCursorData {
  userId: string
  userName: string
  position: { x: number; y: number }
  color: string
}

/**
 * Get remote cursor data for rendering
 *
 * Returns array of cursor positions for active collaborators
 */
export function useCollaborativeCursors(boardId: string): {
  cursors: RemoteCursorData[]
  sendCursor: (x: number, y: number) => void
} {
  const { collaborators } = useActiveCollaborators()
  const sendCursorMove = useSendCursorMove(boardId)

  // Map collaborators to cursor data
  const cursors: RemoteCursorData[] = collaborators
    .filter((c) => c.cursor !== null)
    .map((c) => ({
      userId: c.userId,
      userName: c.fullName || 'Anonymous',
      position: c.cursor!,
      color: getCursorColor(c.userId),
    }))

  // Send cursor position
  const sendCursor = (x: number, y: number) => {
    sendCursorMove(x, y)
  }

  return { cursors, sendCursor }
}
