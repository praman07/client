/**
 * LabelPicker — DropdownMenu multi-select for issue labels.
 *
 * Trigger shows:
 *   - No labels: 🏷 Labels
 *   - Labels selected: ● ● ● Labels · 3 (up to 3 colored dots from selected labels)
 *
 * Menu items stay open on click (closeOnClick={false}) for multi-select.
 * Search filters via plain React state — no cmdk.
 *
 * @layer Features
 */
import { useState } from 'react'
import { Check, Tag } from 'lucide-react'
import type { IssueLabel } from '@/entities/issue-label'
import { cn } from '@/shared/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'

interface LabelPickerProps {
  labels: Array<IssueLabel>
  value: Array<string>
  onToggle: (id: string) => void
}

export function LabelPicker({ labels, value, onToggle }: LabelPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const selectedLabels = labels.filter((l) => value.includes(l.id))
  const filtered = labels.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()),
  )
  const isActive = value.length > 0

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
            ? 'border-subtle bg-layer-2 text-primary'
            : 'border-subtle bg-transparent text-primary hover:bg-layer-2-hover',
        )}
      >
        {isActive ? (
          <>
            {/* Colored dots — up to 3 */}
            <span className="flex items-center gap-0.5">
              {selectedLabels.slice(0, 3).map((l) => (
                <span
                  key={l.id}
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: l.color }}
                />
              ))}
            </span>
            <span>Labels · {value.length}</span>
          </>
        ) : (
          <>
            <Tag
              strokeWidth={2}
              className="size-3"
            />
            <span>Labels</span>
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="w-56 p-0"
      >
        {/* Search input */}
        <div className="p-1.5 pb-0">
          <input
            className="w-full rounded-sm bg-layer-2 px-2 py-1 text-12 outline-none placeholder:text-tertiary"
            placeholder="Search labels…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            autoFocus
          />
        </div>

        <div className="p-1 pt-1.5">
          {filtered.length > 0 && (
            <DropdownMenuGroup>
              <DropdownMenuLabel>Labels</DropdownMenuLabel>
            </DropdownMenuGroup>
          )}

          {filtered.map((label) => {
            const checked = value.includes(label.id)
            return (
              <DropdownMenuItem
                key={label.id}
                closeOnClick={false}
                onClick={() => onToggle(label.id)}
                className={cn(checked && 'bg-accent/40')}
              >
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: label.color }}
                />
                <span>{label.name}</span>
                <Check
                  strokeWidth={2}
                  className={cn(
                    'ml-auto size-3.5 transition-opacity',
                    checked ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </DropdownMenuItem>
            )
          })}

          {filtered.length === 0 && (
            <p className="px-2 py-3 text-center text-12 text-tertiary">
              No labels found
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
