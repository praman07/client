import { useState } from 'react'
import { LayoutGrid, LayoutList, Search } from 'lucide-react'
import { usePaginatedMembers, useSearchValidation, useWorkspaceMembers } from '../hooks'
import { mapMembersError } from '../lib'
import { MemberTableView } from './member-table-view'
import { MemberGridView } from './member-grid-view'
import { MemberListSkeleton } from './member-list-skeleton'
import { MemberGridSkeleton } from './member-grid-skeleton'
import { PaginationControls } from './pagination-controls'
import { Input } from '@/shared/ui'
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

  // Search validation with debounce and character limit
  const {
    processedValue,
    isAtLimit,
    isNearLimit,
    currentLength,
    handleChange,
    maxLength,
  } = useSearchValidation({
    initialValue: '',
    onDebouncedSearch: (value) => {
      setSearch(value)
      setPage(1)
    },
  })

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
      <div className="rounded-xl border border-danger-subtle bg-danger-subtle p-5 animate-in fade-in duration-300">
        <p className="text-14 font-bold text-danger-primary flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-danger-primary" />
          Failed to load members
        </p>
        <p className="text-14 text-danger-secondary mt-1 leading-relaxed">{msg}</p>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tertiary group-focus-within:text-primary transition-colors pointer-events-none" />
            <Input
              placeholder="Filter by name or email..."
              value={processedValue}
              onChange={handleChange}
              maxLength={maxLength}
              aria-label="Search members"
              aria-describedby="member-search-counter"
              className={cn(
                'pl-9 pr-14 h-9 text-14 bg-layer-2 border-subtle transition-all rounded-lg',
                isAtLimit
                  ? 'border-warning-primary ring-2 ring-warning-subtle'
                  : isNearLimit
                  ? 'border-warning-primary/60'
                  : 'focus-visible:ring-accent-subtle hover:bg-layer-2-hover',
                'focus-visible:outline-none',
              )}
            />
            {/* Character counter — accessible live region */}
            <div
              id="member-search-counter"
              aria-live="polite"
              aria-atomic="true"
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 text-11 font-medium transition-colors pointer-events-none',
                isAtLimit
                  ? 'text-warning-primary'
                  : isNearLimit
                  ? 'text-warning-secondary'
                  : 'text-tertiary',
              )}
            >
              {currentLength}/{maxLength}
            </div>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-layer-2 border-subtle rounded-lg p-1 gap-1">
          {(['table', 'grid'] as const).map((mode) => (
            <button
              key={mode}
              aria-label={`${mode} view`}
              onClick={() => handleViewMode(mode)}
              className={cn(
                'h-8 w-8 inline-flex items-center justify-center rounded-md transition-all duration-200',
                viewMode === mode
                  ? 'bg-layer-1 text-primary shadow-sm border border-subtle'
                  : 'text-tertiary hover:text-primary hover:bg-layer-transparent-hover',
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
        <div className="space-y-4 pt-4 border-t border-subtle">
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
            <p className="text-10 text-tertiary uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-layer-2" />
              {totalCount} {totalCount === 1 ? 'member' : 'members'} synced
              {search && (
                <> — filtered by "<span className="text-primary">{search}</span>"</>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
