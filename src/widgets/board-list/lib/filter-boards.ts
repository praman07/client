import type { Board } from '@/entities/whiteboard-board'

interface FilterOptions {
  searchQuery: string
  showArchived: boolean
}

/**
 * Filter boards based on search query and archived status
 *
 * @param boards - Array of boards to filter
 * @param options - Filter options (searchQuery, showArchived)
 * @returns Filtered array
 */
export function filterBoards(boards: Array<Board>, options: FilterOptions): Array<Board> {
  let filtered = boards

  // Filter by archived status
  if (!options.showArchived) {
    filtered = filtered.filter((board) => !board.isArchived)
  }

  // Filter by search query
  if (options.searchQuery.trim()) {
    const query = options.searchQuery.toLowerCase()
    filtered = filtered.filter((board) =>
      board.title.toLowerCase().includes(query),
    )
  }

  return filtered
}
