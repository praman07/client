/**
 * PriorityPicker — DropdownMenu for selecting issue priority.
 *
 * Uses @base-ui/react/menu (DropdownMenu) instead of cmdk for instant,
 * zero-overhead open on 5 fixed static items.
 *
 * @layer Features
 */
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/shared/ui/primitives/dropdown-menu'
import { PriorityBadge } from '@/entities/issue'
import { HugeiconsIcon } from '@hugeicons/react'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/shared/lib/utils'
import type { IssuePriority } from '@/entities/issue'

const PRIORITIES: IssuePriority[] = [
  'URGENT',
  'HIGH',
  'MEDIUM',
  'LOW',
  'NO_PRIORITY',
]
const PRIORITY_LABELS: Record<IssuePriority, string> = {
  URGENT: 'Urgent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  NO_PRIORITY: 'No Priority',
}

interface PriorityPickerProps {
  value: IssuePriority
  onChange: (priority: IssuePriority) => void
}

export function PriorityPicker({ value, onChange }: PriorityPickerProps) {
  const [open, setOpen] = useState(false)
  const isSet = value !== 'NO_PRIORITY'

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors cursor-pointer',
          isSet
            ? 'border-primary/40 bg-primary/5 text-foreground hover:bg-primary/10'
            : 'border-border bg-transparent text-foreground hover:bg-muted/50',
        )}
      >
        <PriorityBadge priority={value} size={12} />
        <span>{isSet ? PRIORITY_LABELS[value] : 'Priority'}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="w-44"
      >
        {PRIORITIES.map((p) => (
          <DropdownMenuItem
            key={p}
            onClick={() => {
              onChange(p)
              setOpen(false)
            }}
          >
            <PriorityBadge priority={p} size={13} showLabel />
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2}
              className={cn(
                'ml-auto size-3.5',
                value === p ? 'opacity-100' : 'opacity-0',
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
