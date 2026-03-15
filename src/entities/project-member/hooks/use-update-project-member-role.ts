import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UPDATE_PROJECT_MEMBER_ROLE } from '../api'
import { projectMemberKeys } from '../api/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

interface UpdateProjectMemberRoleInput {
  projectId: string
  workspaceId: string
  userId: string
  roleId: string
}

/**
 * Assigns an existing project role to a member.
 * Each member can only have one role — this replaces any existing assignment.
 *
 * @layer Entity — mutation hook
 */
export function useUpdateProjectMemberRole() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      workspaceId,
      userId,
      roleId,
    }: UpdateProjectMemberRoleInput) => {
      const token = await getToken()
      return GqlClient(token).request(UPDATE_PROJECT_MEMBER_ROLE, {
        projectId,
        workspaceId,
        userId,
        roleId,
      })
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: projectMemberKeys.list(projectId),
      })
    },
  })
}
