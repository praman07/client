import { useCreateWorkspaceRoleModal } from '../hooks/use-create-workspace-role-modal'
import { CreateWorkspaceRoleForm } from './create-workspace-role-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'

interface CreateWorkspaceRoleDialogProps {
  workspaceId: string
  existingRoleNames: Array<string>
}

export function CreateWorkspaceRoleDialog({
  workspaceId,
  existingRoleNames,
}: CreateWorkspaceRoleDialogProps) {
  const { isOpen, close } = useCreateWorkspaceRoleModal()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>
            Define a new custom role for this workspace.
          </DialogDescription>
        </DialogHeader>
        {/* Render only when open to reset form state on mount */}
        {isOpen && (
          <CreateWorkspaceRoleForm
            workspaceId={workspaceId}
            existingRoleNames={existingRoleNames}
            onClose={close}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
