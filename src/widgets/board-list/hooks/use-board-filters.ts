import { useState } from 'react'

export type SortOption = 'recent' | 'name' | 'oldest'

interface UseBoardFiltersReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  showArchived: boolean
  setShowArchived: (show: boolean) => void
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
}

/**
 * Hook managing board list filters and search
 *
 * Provides state for:
 * - Search query
 * - Show/hide archived boards
 * - Sort order
 */
export function useBoardFilters(): UseBoardFiltersReturn {
  const [searchQuery, setSearchQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('recent')

  return {
    searchQuery,
    setSearchQuery,
    showArchived,
    setShowArchived,
    sortBy,
    setSortBy,
  }
}
