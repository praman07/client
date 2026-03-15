/**
 * IssueFilterToolbar — Filter button + active filter chips row.
 *
 * Layout:
 *   [≡ Filter ▾] [× Status: Todo] [× Priority: High]    (fills flex-1)
 *
 * - FilterMenu: category picker popover
 * - FilterChip: one chip per active filter category with × remove button
 * - "Clear all" link appears when any filter is active
 *
 * @layer Features
 */
import { selectIssueStatuses, selectIssueLabels } from '@/entities/issue'
import { useSelector } from 'react-redux'
import { FilterMenu } from './filter-menu'
import { FilterChip } from './filter-chip'
import { useFilterIssues } from '../hooks/use-filter-issues'

interface IssueFilterToolbarProps {
  projectMembers: Array<{ id: string; fullName: string }>
}

export function IssueFilterToolbar({
  projectMembers,
}: IssueFilterToolbarProps) {
  const statuses = useSelector(selectIssueStatuses)
  const labels = useSelector(selectIssueLabels)
  const {
    filters,
    setFilter,
    removeOneFilter,
    clearAllFilters,
    activeChips,
    hasActiveFilters,
  } = useFilterIssues()

  return (
    <div className="flex flex-1 flex-wrap items-center gap-1.5">
      {/* Filter button → category dropdown */}
      <FilterMenu
        filters={filters}
        statuses={statuses}
        labels={labels}
        projectMembers={projectMembers}
        onSetFilter={setFilter}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Active filter chips */}
      {activeChips.map((chip) => (
        <FilterChip
          key={chip.category}
          chip={chip}
          onRemove={removeOneFilter}
        />
      ))}

      {/* Clear all — only visible when filters are active */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
