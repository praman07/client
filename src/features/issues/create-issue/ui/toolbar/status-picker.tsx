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
  Check,
} from 'lucide-react'
import type { IssueStatus } from '@/entities/issue-status'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'
import { StatusPill } from '@/entities/issue-status'
import { cn } from '@/shared/lib/utils'

interface StatusPickerProps {
  statuses: Array<IssueStatus>
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
          'inline-flex items-center gap-1.5 rounded-md border border-subtle px-2 py-1 text-12 whitespace-nowrap max-w-full overflow-hidden transition-colors cursor-pointer',
          'border-subtle bg-layer-2 text-primary hover:bg-layer-2-hover',
        )}
      >
        <StatusPill status={selected} iconSize={12} />
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
            <Check className={cn(
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
