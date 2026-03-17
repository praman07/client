/**
 * FilterSubMenu — Per-category option list rendered INSIDE FilterMenu's Command panel.
 *
 * Uses Checkbox primitive for multi-select state, ScrollArea for overflow,
 * and CommandItem for keyboard navigation.
 *
 * Rendered directly inside a <Command> — no separate portal/popover, so it
 * stays physically inside the parent PopoverContent (fixes "opening outside" bug).
 *
 * @layer Features
 */
import type { IssueFilters, IssuePriority } from '@/entities/issue'
import type { IssueStatus } from '@/entities/issue-status'
import type { IssueLabel } from '@/entities/issue-label'
import type { FilterCategory } from '../model/types'
import { ScrollArea } from '@/shared/ui/primitives/scroll-area'
import { Checkbox } from '@/shared/ui/primitives/checkbox'
import { StatusIcon } from '@/entities/issue-status'
import { PriorityBadge } from '@/entities/issue'
import { cn } from '@/shared/lib/utils'

const PRIORITY_OPTIONS: Array<{ value: IssuePriority; label: string }> = [
  { value: 'URGENT', label: 'Urgent' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
  { value: 'NO_PRIORITY', label: 'No Priority' },
]

const DUE_DATE_OPTIONS: Array<{
  value: NonNullable<IssueFilters['dueDate']>
  label: string
}> = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due Today' },
  { value: 'this-week', label: 'Due This Week' },
  { value: 'no-date', label: 'No Due Date' },
]

interface FilterSubMenuProps {
  category: FilterCategory
  filters: IssueFilters
  statuses: Array<IssueStatus>
  labels: Array<IssueLabel>
  projectMembers: Array<{ id: string; fullName: string }>
  onSetFilter: (patch: Partial<IssueFilters>) => void
  onBack: () => void
}

function OptionRow({
  checked,
  onToggle,
  children,
}: {
  checked: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm transition hover:bg-muted/60',
        checked && 'bg-muted/30',
      )}
    >
      <Checkbox
        checked={checked}
        readOnly
        className="pointer-events-none"
        tabIndex={-1}
      />
      {children}
    </button>
  )
}

function toggleArray<T>(arr: Array<T> | undefined, value: T): Array<T> {
  const current = arr ?? []
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value]
}

export function FilterSubMenu({
  category,
  filters,
  statuses,
  labels,
  projectMembers,
  onSetFilter,
}: FilterSubMenuProps) {
  if (category === 'statusIds') {
    return (
      <ScrollArea className="max-h-56">
        <div className="space-y-0.5 p-0.5">
          {statuses.map((s) => (
            <OptionRow
              key={s.id}
              checked={filters.statusIds?.includes(s.id) ?? false}
              onToggle={() =>
                onSetFilter({ statusIds: toggleArray(filters.statusIds, s.id) })
              }
            >
              <StatusIcon iconKey={s.icon} color={s.color} size={13} />
              <span className="truncate">{s.name}</span>
            </OptionRow>
          ))}
        </div>
      </ScrollArea>
    )
  }

  if (category === 'priorities') {
    return (
      <div className="space-y-0.5 p-0.5">
        {PRIORITY_OPTIONS.map((p) => (
          <OptionRow
            key={p.value}
            checked={filters.priorities?.includes(p.value) ?? false}
            onToggle={() =>
              onSetFilter({
                priorities: toggleArray(filters.priorities, p.value),
              })
            }
          >
            <PriorityBadge priority={p.value} />
            <span>{p.label}</span>
          </OptionRow>
        ))}
      </div>
    )
  }

  if (category === 'assigneeIds') {
    const members = [
      { id: 'unassigned', fullName: 'Unassigned' },
      ...projectMembers,
    ]
    return (
      <ScrollArea className="max-h-56">
        <div className="space-y-0.5 p-0.5">
          {members.map((m) => (
            <OptionRow
              key={m.id}
              checked={filters.assigneeIds?.includes(m.id) ?? false}
              onToggle={() =>
                onSetFilter({
                  assigneeIds: toggleArray(filters.assigneeIds, m.id),
                })
              }
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium uppercase">
                {m.fullName[0]}
              </span>
              <span className="truncate">{m.fullName}</span>
            </OptionRow>
          ))}
        </div>
      </ScrollArea>
    )
  }

  if (category === 'labelIds') {
    return (
      <ScrollArea className="max-h-56">
        <div className="space-y-0.5 p-0.5">
          {labels.map((l) => (
            <OptionRow
              key={l.id}
              checked={filters.labelIds?.includes(l.id) ?? false}
              onToggle={() =>
                onSetFilter({ labelIds: toggleArray(filters.labelIds, l.id) })
              }
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: l.color }}
              />
              <span className="truncate">{l.name}</span>
            </OptionRow>
          ))}
        </div>
      </ScrollArea>
    )
  }

  if (category === 'dueDate') {
    return (
      <div className="space-y-0.5 p-0.5">
        {DUE_DATE_OPTIONS.map((opt) => (
          <OptionRow
            key={opt.value}
            checked={filters.dueDate === opt.value}
            onToggle={() =>
              onSetFilter({
                dueDate: filters.dueDate === opt.value ? undefined : opt.value,
              })
            }
          >
            <span>{opt.label}</span>
          </OptionRow>
        ))}
      </div>
    )
  }

  return null
}
