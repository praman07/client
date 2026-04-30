/**
 * PriorityPicker — DropdownMenu for selecting issue priority.
 *
 * Uses @base-ui/react/menu (DropdownMenu) instead of cmdk for instant,
 * zero-overhead open on 5 fixed static items.
 *
 * @layer Features
 */
import { useState } from 'react'
import { Check } from 'lucide-react'
import type { IssuePriority } from '@/entities/issue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'
import { PriorityBadge } from '@/entities/issue'
import { cn } from '@/shared/lib/utils'

const PRIORITIES: Array<IssuePriority> = [
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
          'inline-flex items-center gap-1.5 rounded-md border border-subtle px-2 py-1 text-12 whitespace-nowrap transition-colors cursor-pointer',
          isSet
            ? 'border-subtle bg-layer-2 text-primary hover:bg-layer-2-hover'
            : 'border-subtle bg-transparent text-primary hover:bg-layer-2-hover',
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
            <Check
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
