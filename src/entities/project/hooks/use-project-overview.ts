import { useQuery } from '@tanstack/react-query'
import { GET_PROJECT_OVERVIEW } from '../api'
import { projectKeys } from '../api/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

/**
 * Fetches the project overview dashboard data.
 * Consumed by: routes/project.$projectSlug/index.tsx (Overview tab)
 *
 * @layer Entity — read-only query hook
 */
export function useProjectOverview(projectId: string) {
  const { getToken, isSignedIn } = useAuth()

  return useQuery({
    queryKey: projectKeys.overview(projectId),
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(GET_PROJECT_OVERVIEW, { projectId })
    },
    enabled: !!projectId && !!isSignedIn,
    staleTime: 30_000,
  })
}
