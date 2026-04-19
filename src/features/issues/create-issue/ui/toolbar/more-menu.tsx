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
import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar01Icon, MoreHorizontalIcon } from '@hugeicons/core-free-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'
import { Calendar } from '@/shared/ui/primitives/calendar'
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
          'inline-flex items-center gap-1.5 rounded-md border border-subtle px-2 py-1 text-12 whitespace-nowrap transition-colors cursor-pointer',
          isActive
            ? 'border-subtle bg-layer-2 text-primary'
            : 'border-subtle bg-transparent text-primary hover:bg-layer-2-hover',
        )}
      >
        {/* Due date chip — visible when a date is set */}
        {formattedDate && (
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={Calendar01Icon}
              strokeWidth={2}
              className="size-3 text-tertiary"
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

      <DropdownMenuContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="w-48"
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <HugeiconsIcon
              icon={Calendar01Icon}
              strokeWidth={2}
              className="size-3.5 text-tertiary"
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
                if (date) {
                  const year = date.getFullYear()
                  const month = String(date.getMonth() + 1).padStart(2, '0')
                  const day = String(date.getDate()).padStart(2, '0')
                  onDueDateChange(`${year}-${month}-${day}`)
                } else {
                  onDueDateChange(null)
                }
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
