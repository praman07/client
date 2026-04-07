import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { selectCurrentWorkspaceId } from '../model/selectors'
import { GET_WORKSPACE_OVERVIEW_QUERY, workspaceKeys } from '../api'
import { GqlClient } from '@/shared/api'
import { useAppSelector } from '@/shared/hooks'

/**
 * useWorkspaceOverview — fetches the full workspace snapshot in one round-trip.
 *
 * Reads `currentWorkspaceId` directly from Redux (set upstream by `useSyncWorkspaceContext`)
 * so widgets don't need `workspaceId` passed as a prop.
 *
 * Returns: totalProjects, totalMembers, totalIssues, activeProjects, recentMembers.
 */
export function useWorkspaceOverview() {
  const { getToken } = useAuth()
  const workspaceId = useAppSelector(selectCurrentWorkspaceId)

  return useQuery({
    queryKey: workspaceKeys.overview(workspaceId ?? ''),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('No token found')
      const client = GqlClient(token)
      return client.request(GET_WORKSPACE_OVERVIEW_QUERY, {
        workspaceId: workspaceId!,
      })
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000, // 2 min — overview counts are acceptable slightly stale
  })
}
