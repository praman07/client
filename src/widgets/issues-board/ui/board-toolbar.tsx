/**
 * BoardToolbar — Top bar of the Issues board.
 *
 * Contains:
 *   - IssueFilterToolbar (assignee, priority, labels filter chips)
 *   - Refresh button — refetches all 3 board queries (animate-spin while fetching)
 *   - \"Manage Columns\" button → triggers ManageStatusesModal
 *   - \"Manage Labels\" button  → triggers ManageLabelsModal
 *
 * @layer Widgets
 */
import { RefreshCw, Settings2, Tags } from 'lucide-react'
import { Button } from '@/shared/ui/primitives/button'
import { IssueFilterToolbar } from '@/features/issues/filter-issues'
import { cn } from '@/shared/lib/utils'

interface BoardToolbarProps {
  projectMembers: Array<{ id: string; fullName: string }>
  isRefreshing: boolean
  onRefresh: () => void
  onManageStatuses: () => void
  onManageLabels: () => void
}

export function BoardToolbar({
  projectMembers,
  isRefreshing,
  onRefresh,
  onManageStatuses,
  onManageLabels,
}: BoardToolbarProps) {
  return (
    <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2">
      {/* Filter chips */}
      <IssueFilterToolbar projectMembers={projectMembers} />

      <div className="ml-auto flex items-center gap-1">

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          onClick={onManageStatuses}
        >
          <Settings2 className="h-3.5 w-3.5" />
          Columns
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          onClick={onManageLabels}
        >
          <Tags className="h-3.5 w-3.5" />
          Labels
        </Button>
        {/* Refresh — refetches all board queries without a full page reload */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh board"
        >
          <RefreshCw
            className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')}
          />
        </Button>
      </div>
    </div>
  )
}
