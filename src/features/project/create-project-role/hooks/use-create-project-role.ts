import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CREATE_PROJECT_ROLE } from '../api/fragments'
import type { CreateProjectRoleInput } from '../model/schema'
import { projectRoleKeys } from '@/entities/project-role'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useCreateProjectRole(projectId: string, workspaceId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateProjectRoleInput) => {
      const token = await getToken()
      return GqlClient(token).request(CREATE_PROJECT_ROLE, {
        projectId,
        workspaceId,
        input,
      })
    },
    onSuccess: () => {
      toast.success('Role created successfully')
      queryClient.invalidateQueries({
        queryKey: projectRoleKeys.list(projectId),
      })
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create role')
    },
  })
}