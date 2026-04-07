import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { RENAME_WORKSPACE_SLUG_MUTATION, workspaceKeys } from '@/entities/workspace'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useRenameWorkspaceSlug(workspaceId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (slug: string) => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(RENAME_WORKSPACE_SLUG_MUTATION, {
        workspaceId,
        slug,
      })
    },
    onSuccess: (data) => {
      toast.success('Workspace slug updated successfully')
      
      // Refresh the workspace list and the settings cache
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.myWorkspaces(),
      })
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.settings(workspaceId),
      })
      
      return data.renameWorkspaceSlug
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update workspace slug')
    },
  })
}
