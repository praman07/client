import { useMutation, useQueryClient } from '@tanstack/react-query'
import { workspaceKeys, UPDATE_WORKSPACE_MUTATION } from '@/entities/workspace'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { toast } from 'sonner'

export function useUpdateWorkspaceProfile(workspaceId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { name: string }) => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(UPDATE_WORKSPACE_MUTATION, {
        workspaceId,
        input,
      })
    },
    onSuccess: () => {
      toast.success('Workspace updated successfully')
      // Refresh settings cache
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.settings(workspaceId),
      })
      // Refresh myWorkspaces list (sidebar)
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.myWorkspaces(),
      })
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update workspace')
    },
  })
}
