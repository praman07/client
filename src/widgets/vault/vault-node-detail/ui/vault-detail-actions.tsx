import { Download, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/primitives/button'

interface VaultDetailActionsProps {
  type: 'FOLDER' | 'FILE'
  onRename: () => void
  onDelete: () => void
  onDownload?: () => void
}

/**
 * Action buttons shown at the top of the detail panel.
 * Download is only shown for files.
 *
 * Each action callback is wired by the parent (VaultFolderDetail / VaultFileDetail)
 * which holds the actual mutation hooks.
 *
 * @layer Widgets
 */
export function VaultDetailActions({
  type,
  onRename,
  onDelete,
  onDownload,
}: VaultDetailActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={onRename}>
        <Pencil className="h-3.5 w-3.5 mr-1.5" />
        Rename
      </Button>

      {type === 'FILE' && onDownload && (
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Download
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
        Delete
      </Button>
    </div>
  )
}
