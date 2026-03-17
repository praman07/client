import { toast } from 'sonner'
import { Archive, Loader2, RotateCcw } from 'lucide-react'
import { useArchivePage } from '../hooks/use-archive-page'
import { useUnarchivePage } from '../hooks/use-unarchive-page'
import {
  mapArchivePageError,
  mapUnarchivePageError,
} from '../lib/error-mapping'
import { Button } from '@/shared/ui/primitives/button'

export interface ArchivePageButtonProps {
  pageId: string
  projectId: string
  isArchived: boolean
  className?: string
}

/**
 * Toggle button for archiving / restoring a page.
 *
 * Two states:
 *  1. isArchived === false → "Archive" button
 *  2. isArchived === true  → "Restore" button
 *
 * A CONFLICT error on restore means the parent is still archived —
 * shown as a descriptive toast with guidance.
 *
 * @layer Features
 */
export function ArchivePageButton({
  pageId,
  projectId,
  isArchived,
  className,
}: ArchivePageButtonProps) {
  const { mutate: archivePage, isPending: isArchiving } = useArchivePage()
  const { mutate: unarchivePage, isPending: isUnarchiving } = useUnarchivePage()

  const isPending = isArchiving || isUnarchiving

  const handleArchive = () => {
    archivePage(
      { pageId, projectId },
      { onError: (err) => toast.error(mapArchivePageError(err)) },
    )
  }

  const handleUnarchive = () => {
    unarchivePage(
      { pageId, projectId },
      { onError: (err) => toast.error(mapUnarchivePageError(err)) },
    )
  }

  if (isArchived) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={className}
        onClick={handleUnarchive}
        disabled={isPending}
        title="Restore this page"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RotateCcw className="h-4 w-4" />
        )}
        <span className="ml-1.5">Restore</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleArchive}
      disabled={isPending}
      title="Archive this page"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Archive className="h-4 w-4" />
      )}
      <span className="ml-1.5">Archive</span>
    </Button>
  )
}
