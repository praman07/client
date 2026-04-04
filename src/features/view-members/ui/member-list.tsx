import { useState } from 'react'
import { Search, SlidersHorizontal, LayoutList, LayoutGrid } from 'lucide-react'
import { useWorkspaceMembers, usePaginatedMembers } from '../hooks'
import { mapMembersError } from '../lib'
import { MemberTableView } from './member-table-view'
import { MemberGridView } from './member-grid-view'
import { MemberListSkeleton } from './member-list-skeleton'
import { MemberGridSkeleton } from './member-grid-skeleton'
import { PaginationControls } from './pagination-controls'
import { Button, Input } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { useWorkspaceRoles } from '@/entities/workspace/hooks'
import { useAuth } from '@/shared/hooks'

interface MemberListProps {
  workspaceId: string
}

type ViewMode = 'table' | 'grid'

/**
 * MemberList
 * 
 * Main orchestrator for workspace member management.
 * Handles view mode persistence, client-side pagination, and search filtering.
 */
export function MemberList({ workspaceId }: MemberListProps) {
  // Persistence state
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    (localStorage.getItem('members_view_mode') as ViewMode) ?? 'table'
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(() =>
    Number(localStorage.getItem('members_page_size')) || 25
  )

  // Data fetching
  const { data, isLoading, error } = useWorkspaceMembers(workspaceId)
  const { data: roles = [] } = useWorkspaceRoles()
  const { userId: currentUserId } = useAuth()

  // Hierarchy context calculation
  const allMembers = data?.workspaceMembers ?? []
  const actorMember = allMembers.find((m) => m.user.id === currentUserId)
  const actorRoleId = actorMember?.roleId ?? ''
  const actorRole = roles.find((r) => r.id === actorRoleId)
  const actorRank = actorRole?.rank ?? 0

  // Filtering + Pagination
  const { paginated, totalPages, totalCount, safePage } = usePaginatedMembers(
    allMembers,
    search,
    page,
    pageSize
  )

  // Handlers
  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1) // Always reset page on search
  }

  const handleViewMode = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem('members_view_mode', mode)
  }

  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
    localStorage.setItem('members_page_size', String(size))
  }

  if (error) {
    const msg = mapMembersError(error)
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 animate-in fade-in duration-300">
        <p className="text-sm font-bold text-destructive flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
          Failed to load members
        </p>
        <p className="text-sm text-destructive/80 mt-1 leading-relaxed">{msg}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
        {/* Search + Filters */}
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none" />
            <Input
              placeholder="Filter by name or email..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 h-9 text-sm bg-muted/20 border-border/40 focus-visible:ring-primary/20 hover:bg-muted/30 transition-all rounded-lg"
            />
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-muted/20 border border-border/40 rounded-lg p-1 gap-1">
          {(['table', 'grid'] as const).map((mode) => (
            <button
              key={mode}
              aria-label={`${mode} view`}
              onClick={() => handleViewMode(mode)}
              className={cn(
                'h-8 w-8 inline-flex items-center justify-center rounded-md transition-all duration-200',
                viewMode === mode
                  ? 'bg-card text-foreground shadow-sm ring-1 ring-border/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30',
              )}
            >
              {mode === 'table' ? (
                <LayoutList className="h-4 w-4" />
              ) : (
                <LayoutGrid className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Area */}
      <div className="min-h-[400px]">
        {isLoading ? (
          viewMode === 'grid' ? (
            <MemberGridSkeleton />
          ) : (
            <MemberListSkeleton />
          )
        ) : viewMode === 'grid' ? (
          <MemberGridView
            members={paginated}
            workspaceId={workspaceId}
            actorRank={actorRank}
            actorUserId={currentUserId ?? ''}
            search={search}
          />
        ) : (
          <MemberTableView
            members={paginated}
            workspaceId={workspaceId}
            actorRank={actorRank}
            actorUserId={currentUserId ?? ''}
            search={search}
          />
        )}
      </div>

      {/* Footer: Pagination + Counts */}
      {!isLoading && !error && (
        <div className="space-y-4 pt-4 border-t border-border/40">
          {totalPages > 1 && (
            <PaginationControls
              page={safePage}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={handlePageSize}
            />
          )}
          
          {totalCount > 0 && (
            <p className="text-[11px] text-muted-foreground/60 uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              {totalCount} {totalCount === 1 ? 'member' : 'members'} synced
              {search && (
                <> — filtered by "<span className="text-foreground">{search}</span>"</>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
