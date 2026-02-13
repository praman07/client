import { useBoard } from '@/features/whiteboard/fetch-board'

/**
 * Determine if canvas should be read-only
 *
 * Read-only when:
 * - Board is locked (isLocked = true)
 * - Board is archived (future: not implemented yet)
 */
export function useReadOnlyMode(boardId: string): boolean {
  const { data: board } = useBoard(boardId)

  // Read-only if board is locked
  return board?.getBoard?.isLocked ?? false
}
