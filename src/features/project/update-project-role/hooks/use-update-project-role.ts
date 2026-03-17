import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleUpdateProjectRoleError } from '../lib/error-mapping'
import type { UpdateProjectRoleFormValues } from '../model/schema'
import { UPDATE_PROJECT_ROLE, projectRoleKeys  } from '@/entities/project-role'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

interface UpdateProjectRoleInput extends UpdateProjectRoleFormValues {
  roleId: string
  projectId: string
  workspaceId: string
}

export function useUpdateProjectRole() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      roleId,
      projectId,
      workspaceId,
      ...input
    }: UpdateProjectRoleInput) => {
      const token = await getToken()
      return GqlClient(token).request(UPDATE_PROJECT_ROLE, {
        roleId,
        projectId,
        workspaceId,
        input,
      })
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: projectRoleKeys.list(projectId),
      })
    },
    onError: handleUpdateProjectRoleError,
  })
}
