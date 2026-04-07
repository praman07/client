import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CREATE_WORKSPACE_ROLE_MUTATION } from '../api/fragments'
import type { CreateWorkspaceRoleInput } from '../model/schema'
import { workspaceKeys } from '@/entities/workspace'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useCreateWorkspaceRole(workspaceId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateWorkspaceRoleInput) => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(CREATE_WORKSPACE_ROLE_MUTATION, {
        workspaceId,
        input,
      })
    },
    onSuccess: () => {
      toast.success('Role created successfully')
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.roles(workspaceId),
      })
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create role')
    },
  })
}
