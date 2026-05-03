import { useQuery } from '@tanstack/react-query'
import { GET_WORKSPACE_INVITES, workspaceInviteKeys } from '../api'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'

/**
 * Fetches all pending (non-expired) workspace invites.
 * Only callable by actors with workspace:invite:view permission.
 * Returns stale data while refetching (staleTime: 30s).
 */
export function useWorkspaceInvites(workspaceId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: workspaceInviteKeys.list(workspaceId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(GET_WORKSPACE_INVITES, { workspaceId })
    },
    staleTime: 30_000,
  })
}
