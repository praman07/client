import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CREATE_PROJECT } from '../api'
import type { CreateProjectFormValues } from '../model/types'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { projectKeys } from '@/entities/project'

export function useCreateProject() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: CreateProjectFormValues) => {
      const input = {
        name: values.name,
        slug: values.slug || undefined,
        description: values.description,
      }

      const token = await getToken()
      return GqlClient(token).request(CREATE_PROJECT, {
        workspaceId: values.workspaceId,
        input,
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.list(variables.workspaceId),
      })
    },
  })
}
