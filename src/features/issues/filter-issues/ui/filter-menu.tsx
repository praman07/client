/**
 * FilterMenu — Filter button + two-panel picker popover.
 *
 * Architecture (fixes sub-menu opening outside bug):
 *   Single <Popover>, no nested portals.
 *   Panel A: category list (plain buttons + ScrollArea)
 *   Panel B: sub-options for selected category (inline state swap)
 *
 * Primitives: Popover, PopoverContent, PopoverTrigger,
 *             Input, ScrollArea, Button, Separator
 *
 * @layer Features
 */
import { useState } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Signal,
  SlidersHorizontal,
  Tag,
  User,
} from 'lucide-react'
import { FilterSubMenu } from './filter-sub-menu'
import type { IssueFilters } from '@/entities/issue'
import type { IssueStatus } from '@/entities/issue-status'
import type { IssueLabel } from '@/entities/issue-label'
import type { FilterCategory } from '../model/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/primitives/popover'
import { Separator } from '@/shared/ui/primitives/separator'
import { Button } from '@/shared/ui/primitives/button'
import { cn } from '@/shared/lib/utils'

const CATEGORIES: Array<{
  key: FilterCategory
  label: string
  Icon: React.ElementType
}> = [
  { key: 'statusIds', label: 'Status', Icon: LayoutGrid },
  { key: 'priorities', label: 'Priority', Icon: Signal },
  { key: 'assigneeIds', label: 'Assignee', Icon: User },
  { key: 'labelIds', label: 'Label', Icon: Tag },
  { key: 'dueDate', label: 'Due Date', Icon: Calendar },
]

interface FilterMenuProps {
  filters: IssueFilters
  statuses: Array<IssueStatus>
  labels: Array<IssueLabel>
  projectMembers: Array<{ id: string; fullName: string; avatarUrl?: string }>
  onSetFilter: (patch: Partial<IssueFilters>) => void
  hasActiveFilters: boolean
}

export function FilterMenu({
  filters,
  statuses,
  labels,
  projectMembers,
  onSetFilter,
  hasActiveFilters,
}: FilterMenuProps) {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<FilterCategory | null>(
    null,
  )

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setActiveCategory(null)
  }

  const isCategoryActive = (key: FilterCategory) => {
    if (key === 'statusIds') return !!filters.statusIds?.length
    if (key === 'priorities') return !!filters.priorities?.length
    if (key === 'assigneeIds') return !!filters.assigneeIds?.length
    if (key === 'labelIds') return !!filters.labelIds?.length
    if (key === 'dueDate') return !!filters.dueDate
    return false
  }

  const activeCategoryLabel = CATEGORIES.find(
    (c) => c.key === activeCategory,
  )?.label

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className={cn(
          'inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-xs font-medium transition',
          'border-border/40 bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground',
          hasActiveFilters && 'border-primary/50 text-primary',
        )}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filter
      </PopoverTrigger>

      {/* Single portal — sub-panel rendered inside, no nested Popover */}
      <PopoverContent
        className="w-52 gap-0 p-0"
        align="start"
        side="bottom"
        sideOffset={6}
      >
        {activeCategory ? (
          /* ── Panel B: sub-options ─────────────────────────── */
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-start gap-1.5 rounded-none px-2 text-xs text-muted-foreground"
              onClick={() => setActiveCategory(null)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              {activeCategoryLabel}
            </Button>
            <Separator />
            <div className="p-1">
              <FilterSubMenu
                category={activeCategory}
                filters={filters}
                statuses={statuses}
                labels={labels}
                projectMembers={projectMembers}
                onSetFilter={onSetFilter}
                onBack={() => setActiveCategory(null)}
              />
            </div>
          </div>
        ) : (
          /* ── Panel A: category list ──────────────────────── */
          <div className="p-1">
            {CATEGORIES.map(({ key, label, Icon }) => {
              const active = isCategoryActive(key)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategory(key)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition hover:bg-muted/60',
                    active && 'text-primary',
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-left text-xs">{label}</span>
                  {active && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  )}
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </button>
              )
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
