import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/primitives/dialog'
import { RenameFileForm } from './rename-file-form'

interface RenameFileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileId: string
  projectId: string
  folderId: string | null
  currentName: string
}

/**
 * Controlled Dialog shell for renaming a vault file.
 * Open state is owned by the parent widget.
 *
 * @layer Features
 */
export function RenameFileModal({
  open,
  onOpenChange,
  fileId,
  projectId,
  folderId,
  currentName,
}: RenameFileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
          <DialogDescription>
            Enter a new name for &ldquo;{currentName}&rdquo;.
          </DialogDescription>
        </DialogHeader>

        <RenameFileForm
          fileId={fileId}
          projectId={projectId}
          folderId={folderId}
          currentName={currentName}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
