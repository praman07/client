/**
 * StatusPicker — DropdownMenu for selecting issue status.
 *
 * Uses @base-ui/react/menu (DropdownMenu) instead of cmdk for instant,
 * zero-overhead open on static lists of 4–7 items.
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
import { StatusPill } from '@/entities/issue-status'
import { HugeiconsIcon } from '@hugeicons/react'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/shared/lib/utils'
import type { IssueStatus } from '@/entities/issue-status'

interface StatusPickerProps {
  statuses: IssueStatus[]
  value: string
  onChange: (id: string) => void
}

export function StatusPicker({ statuses, value, onChange }: StatusPickerProps) {
  const [open, setOpen] = useState(false)
  const selected = statuses.find((s) => s.id === value) ?? statuses[0]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs whitespace-nowrap max-w-full overflow-hidden transition-colors cursor-pointer',
          'border-primary/40 bg-primary/5 text-foreground hover:bg-primary/10',
        )}
      >
        {selected && <StatusPill status={selected} iconSize={12} />}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="w-52"
      >
        {statuses.map((status) => (
          <DropdownMenuItem
            key={status.id}
            onClick={() => {
              onChange(status.id)
              setOpen(false)
            }}
          >
            <StatusPill status={status} iconSize={13} />
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2}
              className={cn(
                'ml-auto size-3.5',
                value === status.id ? 'opacity-100' : 'opacity-0',
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
