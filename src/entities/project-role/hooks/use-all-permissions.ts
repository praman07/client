import { useQuery } from '@tanstack/react-query'
import { GET_ALL_PERMISSIONS } from '../api'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

/**
 * Fetches project-relevant permissions from the server.
 * Workspace-only permissions (workspace:*, workspace.role:*, workspace.member:*)
 * are excluded server-side — they don't belong in the project role picker.
 *
 * @layer Entity — read-only query hook
 */
export function useAllPermissions(workspaceId: string) {
  const { getToken, isSignedIn } = useAuth()

  return useQuery({
    queryKey: ['allPermissions', workspaceId],
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(GET_ALL_PERMISSIONS, { workspaceId })
    },
    enabled: !!isSignedIn && !!workspaceId,
    staleTime: 1000 * 60 * 10, // 10 min — catalogue rarely changes
  })
}
