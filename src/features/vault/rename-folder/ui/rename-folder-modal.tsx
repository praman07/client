import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/primitives/dialog'
import { RenameFolderForm } from './rename-folder-form'

interface RenameFolderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folderId: string
  projectId: string
  parentFolderId: string | null
  currentName: string
}

/**
 * Controlled Dialog shell for renaming a vault folder.
 * Open state is owned by the parent widget.
 *
 * @layer Features
 */
export function RenameFolderModal({
  open,
  onOpenChange,
  folderId,
  projectId,
  parentFolderId,
  currentName,
}: RenameFolderModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Rename folder</DialogTitle>
          <DialogDescription>
            Enter a new name for &ldquo;{currentName}&rdquo;.
          </DialogDescription>
        </DialogHeader>

        <RenameFolderForm
          folderId={folderId}
          projectId={projectId}
          parentFolderId={parentFolderId}
          currentName={currentName}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
