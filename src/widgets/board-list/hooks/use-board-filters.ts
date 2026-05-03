import { useState } from 'react'

export type SortOption = 'recent' | 'name' | 'oldest'

interface UseBoardFiltersReturn {
  showArchived: boolean
  setShowArchived: (show: boolean) => void
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
}

/**
 * Hook managing board list filters
 *
 * Provides state for:
 * - Show/hide archived boards
 * - Sort order
 */
export function useBoardFilters(): UseBoardFiltersReturn {
  const [showArchived, setShowArchived] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('recent')

  return {
    showArchived,
    setShowArchived,
    sortBy,
    setSortBy,
  }
}
