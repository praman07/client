import { useState } from 'react'

export type ViewMode = 'grid' | 'list'

interface UseViewModeReturn {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  toggleViewMode: () => void
}

/**
 * Hook managing grid vs list view mode
 *
 * Provides toggle between grid and list layouts
 */
export function useViewMode(): UseViewModeReturn {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'))
  }

  return {
    viewMode,
    setViewMode,
    toggleViewMode,
  }
}
