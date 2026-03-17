import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleCreateProjectRoleError } from '../lib/error-mapping'
import type { CreateProjectRoleFormValues } from '../model/schema'
import { CREATE_PROJECT_ROLE, projectRoleKeys  } from '@/entities/project-role'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

interface CreateProjectRoleInput extends CreateProjectRoleFormValues {
  projectId: string
  workspaceId: string
}

export function useCreateProjectRole() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      workspaceId,
      ...input
    }: CreateProjectRoleInput) => {
      const token = await getToken()
      return GqlClient(token).request(CREATE_PROJECT_ROLE, {
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
    onError: handleCreateProjectRoleError,
  })
}
