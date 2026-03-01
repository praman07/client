import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/ui/primitives/dialog'
import { CreateFolderForm } from './create-folder-form'

interface CreateFolderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  /** null = create at root level */
  parentFolderId: string | null
  /** Called after a successful folder creation */
  onSuccess?: () => void
}

/**
 * Controlled dialog shell that wraps CreateFolderForm.
 * State (open/close) is owned by the parent widget.
 *
 * @layer Features
 */
export function CreateFolderModal({
  open,
  onOpenChange,
  projectId,
  parentFolderId,
  onSuccess,
}: CreateFolderModalProps) {
  function handleSuccess() {
    onOpenChange(false)
    onSuccess?.()
  }

  function handleCancel() {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
          <DialogDescription>
            Choose a name for your new folder.
          </DialogDescription>
        </DialogHeader>

        <CreateFolderForm
          projectId={projectId}
          parentFolderId={parentFolderId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
