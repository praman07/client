import { useQuery } from '@tanstack/react-query'
import { GET_PROJECT_MEMBERS } from '../api'
import { projectMemberKeys } from '../api/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

/**
 * Fetches the full member list for a project.
 * Consumed by: routes/project.$slug/settings/members
 *
 * @layer Entity — read-only query hook
 */
export function useProjectMembers(projectId: string) {
  const { getToken, isSignedIn } = useAuth()

  return useQuery({
    queryKey: projectMemberKeys.list(projectId),
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(GET_PROJECT_MEMBERS, { projectId })
    },
    enabled: !!projectId && !!isSignedIn,
    staleTime: 30_000,
  })
}
