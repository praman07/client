import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UPDATE_PROJECT_MEMBER_ROLE } from '@/entities/project-member'
import { projectMemberKeys } from '@/entities/project-member'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { handleUpdateProjectMemberRoleError } from '../lib/error-mapping'

interface UpdateProjectMemberRoleInput {
  projectId: string
  workspaceId: string
  userId: string
  roleId: string
}

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
    onError: handleUpdateProjectMemberRoleError,
  })
}
