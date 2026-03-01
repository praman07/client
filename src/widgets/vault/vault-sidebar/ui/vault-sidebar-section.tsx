import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface VaultSidebarSectionProps {
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
}

/**
 * Collapsible section header for sidebar groupings (Pinned / System Folders).
 * @layer Widgets
 */
export function VaultSidebarSection({
  label,
  defaultOpen = true,
  children,
}: VaultSidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="flex flex-col gap-0.5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight
          className={cn(
            'h-3 w-3 transition-transform duration-200',
            open && 'rotate-90',
          )}
        />
        {label}
      </button>
      {open && <div className="flex flex-col gap-0.5">{children}</div>}
    </div>
  )
}
