import { Grid, List, SlidersHorizontal, SquarePen } from 'lucide-react'
import type { SortOption, ViewMode } from '../hooks'
import { Input } from '@/shared/ui/primitives/input'
import { Button } from '@/shared/ui/primitives/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select'
import { Guard } from '@/shared/lib/auth/guard'

interface BoardListHeaderProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  viewMode: ViewMode
  onViewModeToggle: () => void
  showArchived: boolean
  onShowArchivedChange: (show: boolean) => void
  onCreateBoard: () => void
}

/**
 * Board list header with search, filters, and view toggle
 */
export function BoardListHeader({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeToggle,
  showArchived,
  onShowArchivedChange,
  onCreateBoard,
}: BoardListHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Sort */}
      <Select
        value={sortBy}
        onValueChange={(v) => onSortChange(v as SortOption)}
      >
        <SelectTrigger className="w-40">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="name">Name (A-Z)</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
        </SelectContent>
      </Select>

      {/* Show Archived Toggle */}
      <Button
        variant={showArchived ? 'default' : 'outline'}
        size="sm"
        onClick={() => onShowArchivedChange(!showArchived)}
      >
        {showArchived ? 'Hide' : 'Show'} Archived
      </Button>

      {/* View Toggle */}
      <Button variant="outline" size="sm" onClick={onViewModeToggle}>
        {viewMode === 'grid' ? (
          <List className="h-4 w-4" />
        ) : (
          <Grid className="h-4 w-4" />
        )}
      </Button>

      {/* Create Board — Guard-gated */}
      <Guard permission="whiteboard:create">
        <Button size="sm" onClick={onCreateBoard} className="gap-1.5 shrink-0">
          <SquarePen className="h-4 w-4" />
          New Board
        </Button>
      </Guard>
    </div>
  )
}
