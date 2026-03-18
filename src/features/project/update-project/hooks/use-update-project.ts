import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleUpdateProjectError } from '../lib/error-mapping'
import type { UpdateProjectFormValues } from '../model/schema'
import { UPDATE_PROJECT, projectKeys  } from '@/entities/project'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useUpdateProject(projectId: string, workspaceId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: UpdateProjectFormValues) => {
      const token = await getToken()
      return GqlClient(token).request(UPDATE_PROJECT, {
        projectId,
        input: { name: values.name, description: values.description },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) })
    },
    onError: handleUpdateProjectError,
  })
}
