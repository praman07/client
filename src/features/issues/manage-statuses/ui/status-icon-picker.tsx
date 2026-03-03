/**
 * StatusIconPicker — Popover for editing a status column's icon and color.
 *
 * Opened by clicking the colored icon button in StatusListRow.
 * - Icon grid: 6 options matching ICON_MAP in entities/issue-status
 * - Color palette: 12 presets + free hex input
 *
 * Each selection fires useUpdateStatus immediately (optimistic).
 * Active selection is highlighted with a ring.
 *
 * System statuses can change icon/color (name remains locked separately).
 *
 * @layer Features
 */
import { useState, useCallback } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/primitives/popover'
import { Input } from '@/shared/ui/primitives/input'
import { cn } from '@/shared/lib/utils'
import { StatusIcon } from '@/entities/issue-status'
import type { IssueStatus } from '@/entities/issue-status'
import { useUpdateStatus } from '../hooks'
import { ICON_OPTIONS, COLOR_PRESETS } from '../lib/status-presets'

interface StatusIconPickerProps {
  status: IssueStatus
  projectId: string
}

export function StatusIconPicker({ status, projectId }: StatusIconPickerProps) {
  const [open, setOpen] = useState(false)
  const [hexInput, setHexInput] = useState(status.color)
  const { mutate: updateStatus } = useUpdateStatus(projectId)

  const applyIcon = useCallback(
    (iconKey: string) => {
      updateStatus({ statusId: status.id, icon: iconKey })
      setOpen(false)
    },
    [status.id, updateStatus],
  )

  const applyColor = useCallback(
    (hex: string) => {
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        updateStatus({ statusId: status.id, color: hex })
        setHexInput(hex)
      }
    },
    [status.id, updateStatus],
  )

  const handleHexCommit = (value: string) => {
    const normalized = value.startsWith('#') ? value : `#${value}`
    applyColor(normalized)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="flex shrink-0 cursor-pointer items-center justify-center rounded p-0.5 transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Edit status icon and color"
      >
        <StatusIcon iconKey={status.icon} color={status.color} size={16} />
      </PopoverTrigger>

      <PopoverContent className="w-52 p-3" align="start" side="bottom">
        {/* Icon section */}
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Icon</p>
        <div className="mb-3 grid grid-cols-6 gap-1">
          {ICON_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              title={label}
              onClick={() => applyIcon(key)}
              className={cn(
                'flex items-center justify-center rounded p-1.5 transition hover:bg-muted',
                status.icon === key && 'ring-2 ring-ring ring-offset-1',
              )}
            >
              <StatusIcon iconKey={key} color={status.color} size={14} />
            </button>
          ))}
        </div>

        {/* Color section */}
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
          Color
        </p>
        <div className="mb-2 grid grid-cols-6 gap-1">
          {COLOR_PRESETS.map((hex) => (
            <button
              key={hex}
              type="button"
              title={hex}
              onClick={() => applyColor(hex)}
              className={cn(
                'h-5 w-5 rounded-full border border-border/40 transition hover:scale-110',
                status.color === hex && 'ring-2 ring-ring ring-offset-1',
              )}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>

        {/* Free hex input */}
        <Input
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={(e) => handleHexCommit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleHexCommit(e.currentTarget.value)
          }}
          placeholder="#6B7280"
          className="h-7 text-xs font-mono"
          maxLength={7}
        />
      </PopoverContent>
    </Popover>
  )
}
