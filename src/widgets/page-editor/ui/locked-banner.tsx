import { HugeiconsIcon } from '@hugeicons/react'
import { LockIcon } from '@hugeicons/core-free-icons'

/**
 * LockedBanner — shown when page is locked by an admin.
 * The Tiptap editor is set to editable=false in this state.
 *
 * @layer Widgets
 */
export function LockedBanner() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 mb-4">
      <HugeiconsIcon icon={LockIcon} className="h-4 w-4 shrink-0" />
      <span>
        This page is locked by an admin and is currently{' '}
        <strong>read-only</strong>.
      </span>
    </div>
  )
}
