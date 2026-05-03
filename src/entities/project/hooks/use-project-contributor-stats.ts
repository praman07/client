import { useQuery } from '@tanstack/react-query'
import { GET_PROJECT_CONTRIBUTOR_STATS } from '../api'
import { projectKeys } from '../api/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

/**
 * Hook to fetch contributor workload stats (assigned, completed).
 * Used by: ContributorActivity widget.
 */
export function useProjectContributorStats(projectId: string) {
  const { getToken, isSignedIn } = useAuth()

  return useQuery({
    queryKey: projectKeys.contributorStats(projectId),
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(GET_PROJECT_CONTRIBUTOR_STATS, { projectId })
    },
    enabled: !!projectId && isSignedIn,
    staleTime: 60_000,
  })
}
