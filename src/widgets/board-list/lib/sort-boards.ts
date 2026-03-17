import type { SortOption } from '../hooks/use-board-filters'
import type { Board } from '@/entities/whiteboard-board'

/**
 * Sort boards based on selected option
 *
 * @param boards - Array of boards to sort
 * @param sortBy - Sort option (recent, name, oldest)
 * @returns Sorted array
 */
export function sortBoards(boards: Array<Board>, sortBy: SortOption): Array<Board> {
  const sorted = [...boards]

  switch (sortBy) {
    case 'recent':
      return sorted.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )

    case 'oldest':
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )

    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))

    default:
      return sorted
  }
}
