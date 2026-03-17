import { useQuery } from '@tanstack/react-query'
import { GET_ACTIVE_PAGE_COLLABORATORS } from '../api/fragments'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { PageCollaborator } from '@/entities/page'
import type { GetActivePageCollaboratorsQuery } from '@/gql/graphql'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { pageKeys } from '@/entities/page'

/**
 * GraphQL snapshot of who is currently viewing/editing this page (Redis ZSET).
 *
 * Use this as a fallback when WS presence is unavailable, or during initial
 * page load before the WS subscription is established.
 *
 * For live, event-driven presence: use useActivePageCollaborators from
 * the page-presence entity (Redux/WS-driven — preferred when WS is active).
 *
 * Cache: staleTime 10s, refetchInterval 30s — Redis presence is volatile;
 * poll every 30s while the component is mounted to keep the list fresh.
 *
 * Hook name: useActiveCollaboratorsSnapshot to avoid collision with
 * page-presence/hooks/useActivePageCollaborators (the Redux WS-driven hook).
 *
 * @layer Features
 */
export function useActiveCollaboratorsSnapshot(
  pageId: string,
  options?: Omit<
    UseQueryOptions<GetActivePageCollaboratorsQuery, Error, Array<PageCollaborator>>,
    'queryKey' | 'queryFn' | 'select'
  >,
) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: pageKeys.activeCollaborators(pageId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(GET_ACTIVE_PAGE_COLLABORATORS, { pageId })
    },
    select: (data) => data.getActivePageCollaborators as Array<PageCollaborator>,
    enabled: !!pageId,
    staleTime: 10_000, // 10s — Redis presence changes as users navigate
    refetchInterval: 30_000, // Poll every 30s while mounted
    ...options,
  })
}
