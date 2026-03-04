/**
 * MoreMenu — DropdownMenu for overflow toolbar actions.
 *
 * Trigger shows:
 *   - No due date: ···
 *   - Due date set: 📅 Mar 5  ···
 *
 * Due date Calendar renders inside DropdownMenuSub content.
 *
 * @layer Features
 */
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/shared/ui/primitives/dropdown-menu'
import { Calendar } from '@/shared/ui/primitives/calendar'
import { HugeiconsIcon } from '@hugeicons/react'
import { MoreHorizontalIcon, Calendar01Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/shared/lib/utils'

interface MoreMenuProps {
  dueDate: string | null
  onDueDateChange: (date: string | null) => void
}

export function MoreMenu({ dueDate, onDueDateChange }: MoreMenuProps) {
  const [open, setOpen] = useState(false)
  const selectedDate = dueDate ? new Date(dueDate) : undefined
  const isActive = dueDate !== null

  const formattedDate = dueDate
    ? new Date(dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors cursor-pointer',
          isActive
            ? 'border-primary/40 bg-primary/5 text-foreground'
            : 'border-border bg-transparent text-foreground hover:bg-muted/50',
        )}
      >
        {/* Due date chip — visible when a date is set */}
        {formattedDate && (
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={Calendar01Icon}
              strokeWidth={2}
              className="size-3 text-muted-foreground"
            />
            <span>{formattedDate}</span>
          </span>
        )}
        <HugeiconsIcon
          icon={MoreHorizontalIcon}
          strokeWidth={2}
          className="size-3.5"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" side="bottom" sideOffset={6} className="w-48">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <HugeiconsIcon
              icon={Calendar01Icon}
              strokeWidth={2}
              className="size-3.5 text-muted-foreground"
            />
            {dueDate ? 'Change due date' : 'Set due date'}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            side="right"
            align="start"
            className="w-auto p-0"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDueDateChange(date ? date.toISOString().split('T')[0] : null)
                setOpen(false)
              }}
              initialFocus
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
