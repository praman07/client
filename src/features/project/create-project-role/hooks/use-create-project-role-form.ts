import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { handleCreateProjectRoleError } from '../lib/error-mapping'
import { closeCreateRoleDialog } from '../model/slice'
import { useCreateProjectRole } from './use-create-project-role'
import type { CreateProjectRoleFormValues } from '../model/schema'
import { useAppDispatch } from '@/shared/hooks'
import { useAssignRolePermission } from '@/features/project/manage-role-permissions'
import { projectMemberKeys, useUpdateProjectMemberRole  } from '@/entities/project-member'
import { rolePermissionKeys } from '@/entities/project-role'

interface UseCreateProjectRoleFormProps {
  projectId: string
  workspaceId: string
  selectedPermissionIds: Array<string>
  selectedMemberIds: Array<string>
  onSuccess?: () => void
}

/**
 * Handles the 2-phase create-role submission:
 *   Phase 1: createProjectRole mutation
 *   Phase 2a: assignRolePermission × N (parallel)
 *   Phase 2b: updateProjectMemberRole × M (parallel)
 *
 * Returns a `submit(values)` function consumed by the multi-step dialog orchestrator.
 * Dialog owns all form/picker state — this hook only handles async coordination.
 */
export function useCreateProjectRoleForm({
  projectId,
  workspaceId,
  selectedPermissionIds,
  selectedMemberIds,
  onSuccess,
}: UseCreateProjectRoleFormProps) {
  const [isPending, setIsPending] = useState(false)
  const { mutateAsync: createRole } = useCreateProjectRole()
  const { mutateAsync: assignPermission } = useAssignRolePermission()
  const { mutateAsync: assignMemberRole } = useUpdateProjectMemberRole()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const submit = useCallback(
    async (values: CreateProjectRoleFormValues) => {
      setIsPending(true)
      let roleId: string

      try {
        // Phase 1 — create the role
        const result = await createRole({ ...values, projectId, workspaceId })
        // Cast: createProjectRole always returns ProjectRole! with id per SDL (fragment masking)
        roleId = (result.createProjectRole as unknown as { id: string }).id
      } catch (err) {
        handleCreateProjectRoleError(err)
        setIsPending(false)
        return
      }

      // Phase 2a — assign permissions (Promise.allSettled — never blocks on partial failure)
      const permResults = await Promise.allSettled(
        selectedPermissionIds.map((permissionId) =>
          assignPermission({
            roleId,
            workspaceId,
            permissionId,
            effect: 'ALLOW',
          }),
        ),
      )

      // Phase 2b — assign member roles
      const memberResults = await Promise.allSettled(
        selectedMemberIds.map((userId) =>
          assignMemberRole({ projectId, workspaceId, userId, roleId }),
        ),
      )

      // Invalidate caches
      await queryClient.invalidateQueries({
        queryKey: rolePermissionKeys.list(roleId),
      })
      await queryClient.invalidateQueries({
        queryKey: projectMemberKeys.list(projectId),
      })

      // Report partial failures
      const failed =
        permResults.filter((r) => r.status === 'rejected').length +
        memberResults.filter((r) => r.status === 'rejected').length
      if (failed > 0) {
        toast.warning(
          `Role created, but ${failed} assignment${failed !== 1 ? 's' : ''} failed. You can retry via the permission panel.`,
        )
      }

      setIsPending(false)
      dispatch(closeCreateRoleDialog())
      onSuccess?.()
    },
    [
      projectId,
      workspaceId,
      selectedPermissionIds,
      selectedMemberIds,
      createRole,
      assignPermission,
      assignMemberRole,
      queryClient,
      dispatch,
      onSuccess,
    ],
  )

  return { submit, isPending }
}
