import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleDeleteProjectRoleError } from '../lib/error-mapping'
import { DELETE_PROJECT_ROLE, projectRoleKeys  } from '@/entities/project-role'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

interface DeleteProjectRoleInput {
  roleId: string
  projectId: string
  workspaceId: string
}

export function useDeleteProjectRole() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      roleId,
      projectId,
      workspaceId,
    }: DeleteProjectRoleInput) => {
      const token = await getToken()
      return GqlClient(token).request(DELETE_PROJECT_ROLE, {
        roleId,
        projectId,
        workspaceId,
      })
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: projectRoleKeys.list(projectId),
      })
    },
    onError: handleDeleteProjectRoleError,
  })
}
