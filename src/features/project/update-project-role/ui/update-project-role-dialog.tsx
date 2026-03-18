import {
  closeUpdateRoleDialog,
  selectIsUpdateRoleDialogOpen,
  selectUpdateRoleId,
} from '../model/slice'
import { UpdateProjectRoleForm } from './update-project-role-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui'
import { useAppDispatch, useAppSelector } from '@/shared/hooks'
import { PROJECT_ROLE_FIELDS, useProjectRoles  } from '@/entities/project-role'
import { useFragment } from '@/gql'

interface UpdateProjectRoleDialogProps {
  projectId: string
  workspaceId: string
}

export function UpdateProjectRoleDialog({
  projectId,
  workspaceId,
}: UpdateProjectRoleDialogProps) {
  const isOpen = useAppSelector(selectIsUpdateRoleDialogOpen)
  const roleId = useAppSelector(selectUpdateRoleId)
  const dispatch = useAppDispatch()

  const { data } = useProjectRoles(projectId, workspaceId)
  const maskedRoles = data?.projectRoles ?? []
  const roles = useFragment(PROJECT_ROLE_FIELDS, maskedRoles)
  const role = roleId ? roles.find((r) => r.id === roleId) : null

  if (!role) return null

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && dispatch(closeUpdateRoleDialog())}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update the details of the <strong>{role.name}</strong> role.
          </DialogDescription>
        </DialogHeader>
        <UpdateProjectRoleForm
          roleId={role.id}
          projectId={projectId}
          workspaceId={workspaceId}
          defaultValues={{
            name: role.name,
            rank: role.rank,
            description: role.description ?? undefined,
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
