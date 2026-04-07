import { useQuery } from '@tanstack/react-query'
import { GET_WORKSPACE_MEMBERS } from '../api/fragments'
import { workspaceMemberKeys } from '../api/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

/**
 * Fetches all members of a workspace with their role information.
 *
 * Lives in the Entity layer — consumable by any feature or widget
 * that needs workspace member data without cross-feature coupling.
 *
 * Cache key: workspaceMemberKeys.list(workspaceId)
 * staleTime: 30s — members list is stable but should reflect recent changes.
 *
 * @layer Entity — workspace
 */
export function useWorkspaceMembers(workspaceId: string) {
  const { getToken, isSignedIn } = useAuth()

  return useQuery({
    queryKey: workspaceMemberKeys.list(workspaceId),
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(GET_WORKSPACE_MEMBERS, { workspaceId })
    },
    enabled: !!workspaceId && !!isSignedIn,
    staleTime: 30_000,
  })
}
