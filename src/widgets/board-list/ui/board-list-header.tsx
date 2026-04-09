import { Grid, List, Search, SlidersHorizontal, SquarePen } from 'lucide-react'
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
  searchQuery: string
  onSearchChange: (query: string) => void
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
  searchQuery,
  onSearchChange,
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
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search boards..."
          className="pl-10"
        />
      </div>

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
