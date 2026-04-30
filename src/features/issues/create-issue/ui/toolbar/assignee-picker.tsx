/**
 * AssigneePicker — DropdownMenu with inline search for selecting an assignee.
 *
 * Uses @base-ui/react/menu (DropdownMenu) for instant open.
 * Search is a plain controlled <input> inside the menu content,
 * filtered in React state — no cmdk overhead.
 *
 * Trigger shows:
 *   - Unassigned: 👤 Assignee
 *   - Assigned:   <Avatar> Full Name  (real photo if avatarUrl, else initials)
 *
 * @layer Features
 */
import { useState } from 'react'
import { Check, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import { cn } from '@/shared/lib/utils'

interface Member {
  id: string
  fullName: string
  avatarUrl?: string
}

interface AssigneePickerProps {
  members: Array<Member>
  value: string | null
  onChange: (id: string | null) => void
}

export function AssigneePicker({
  members,
  value,
  onChange,
}: AssigneePickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selected = members.find((m) => m.id === value)
  const isActive = value !== null

  const filtered = members.filter((m) =>
    m.fullName.toLowerCase().includes(search.toLowerCase()),
  )

  const initials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) setSearch('')
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border border-subtle px-2 py-1 text-12 whitespace-nowrap transition-colors cursor-pointer',
          isActive
            ? 'border-subtle bg-layer-2 text-primary hover:bg-layer-2-hover'
            : 'border-subtle bg-transparent text-primary hover:bg-layer-2-hover',
        )}
      >
        {selected ? (
          <>
            <Avatar className="size-3.5">
              {selected.avatarUrl && (
                <AvatarImage src={selected.avatarUrl} alt={selected.fullName} />
              )}
              <AvatarFallback className="text-[8px]">
                {initials(selected.fullName)}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-[96px] truncate">{selected.fullName}</span>
          </>
        ) : (
          <>
            <User strokeWidth={2} className="size-3" />
            <span>Assignee</span>
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="w-52 p-0"
      >
        {/* Search input — plain, no cmdk */}
        <div className="p-1.5 pb-0">
          <input
            className="w-full rounded-sm bg-layer-2 px-2 py-1 text-12 outline-none placeholder:text-tertiary"
            placeholder="Search members…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            // Prevent DropdownMenu from closing when typing
            onKeyDown={(e) => e.stopPropagation()}
            autoFocus
          />
        </div>

        <div className="p-1 pt-1.5">
          {/* Unassigned */}
          <DropdownMenuItem
            onClick={() => {
              onChange(null)
              setOpen(false)
            }}
          >
            <span className="text-tertiary">Unassigned</span>
            <Check
              strokeWidth={2}
              className={cn(
                'ml-auto size-3.5',
                value === null ? 'opacity-100' : 'opacity-0',
              )}
            />
          </DropdownMenuItem>

          {filtered.length > 0 && <DropdownMenuSeparator />}

          {filtered.map((m) => (
            <DropdownMenuItem
              key={m.id}
              onClick={() => {
                onChange(m.id)
                setOpen(false)
              }}
            >
              <Avatar className="size-4">
                {m.avatarUrl && (
                  <AvatarImage src={m.avatarUrl} alt={m.fullName} />
                )}
                <AvatarFallback className="text-[9px]">
                  {initials(m.fullName)}
                </AvatarFallback>
              </Avatar>
              <span className="max-w-[120px] truncate">{m.fullName}</span>
              <Check
                strokeWidth={2}
                className={cn(
                  'ml-auto size-3.5',
                  value === m.id ? 'opacity-100' : 'opacity-0',
                )}
              />
            </DropdownMenuItem>
          ))}

          {filtered.length === 0 && (
            <p className="px-2 py-3 text-center text-12 text-tertiary">
              No members found
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
