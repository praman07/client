import { toast } from 'sonner'
import { Lock, LockOpen, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/primitives/button'
import { useLockPage } from '../hooks/use-lock-page'
import { useUnlockPage } from '../hooks/use-unlock-page'
import { mapLockPageError, mapUnlockPageError } from '../lib/error-mapping'

export interface PageLockButtonProps {
  pageId: string
  projectId: string
  isLocked: boolean
  lockedBy?: string | null
  currentUserId: string
  className?: string
}

/**
 * Toggle button for locking/unlocking a page.
 *
 * Three visual states:
 *  1. isLocked === false          → "Lock" button (lock icon)
 *  2. isLocked === true, own lock → "Unlock" button (unlock icon)
 *  3. isLocked === true, other's  → Locked indicator (disabled, no action)
 *
 * Workspace ADMINs can unlock any page — their permission is enforced
 * server-side (FORBIDDEN + user-friendly message if not).
 *
 * @layer Features
 */
export function PageLockButton({
  pageId,
  projectId,
  isLocked,
  lockedBy,
  currentUserId,
  className,
}: PageLockButtonProps) {
  const { mutate: lockPage, isPending: isLocking } = useLockPage()
  const { mutate: unlockPage, isPending: isUnlocking } = useUnlockPage()

  const isPending = isLocking || isUnlocking
  const isLockedByOther = isLocked && lockedBy !== currentUserId

  const handleLock = () => {
    lockPage(
      { pageId, projectId },
      {
        onError: (err) => toast.error(mapLockPageError(err)),
      },
    )
  }

  const handleUnlock = () => {
    unlockPage(
      { pageId, projectId },
      {
        onError: (err) => toast.error(mapUnlockPageError(err)),
      },
    )
  }

  // State 3: locked by someone else — show indicator, no action
  if (isLockedByOther) {
    return (
      <div
        className={`flex items-center gap-1.5 text-xs text-muted-foreground ${className ?? ''}`}
        title="Page is locked by another editor"
      >
        <Lock className="h-3.5 w-3.5" />
        <span>Locked</span>
      </div>
    )
  }

  // State 1: unlocked — show Lock button
  if (!isLocked) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={className}
        onClick={handleLock}
        disabled={isPending}
        title="Lock page for exclusive editing"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LockOpen className="h-4 w-4" />
        )}
        <span className="ml-1.5">Lock</span>
      </Button>
    )
  }

  // State 2: own lock — show Unlock button
  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleUnlock}
      disabled={isPending}
      title="Release exclusive lock"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Lock className="h-4 w-4" />
      )}
      <span className="ml-1.5">Unlock</span>
    </Button>
  )
}
