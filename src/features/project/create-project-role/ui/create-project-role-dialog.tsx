import { useCreateProjectRoleModal } from '../hooks/use-create-project-role-modal'
import { CreateProjectRoleForm } from './create-project-role-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'

interface CreateProjectRoleDialogProps {
  projectId: string
  workspaceId: string
  existingRoleNames: Array<string>
}

export function CreateProjectRoleDialog({
  projectId,
  workspaceId,
  existingRoleNames,
}: CreateProjectRoleDialogProps) {
  const { isOpen, close } = useCreateProjectRoleModal()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>
            Define a new custom role for this project.
          </DialogDescription>
        </DialogHeader>
        {/* Render only when open to reset form state on mount */}
        {isOpen && (
          <CreateProjectRoleForm
            projectId={projectId}
            workspaceId={workspaceId}
            existingRoleNames={existingRoleNames}
            onClose={close}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}