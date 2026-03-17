import { useQuery } from '@tanstack/react-query'
import { GET_PAGE_COLLABORATORS } from '../api/fragments'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { PageCollaborator } from '@/entities/page'
import type { GetPageCollaboratorsQuery } from '@/gql/graphql'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { pageKeys } from '@/entities/page'

/**
 * Fetches the authoritative DB collaborator list for a page.
 *
 * This is the persistent access list (everyone with a role on the page).
 * For live presence (who is currently online), see useActivePageCollaborators
 * in the page-presence entity (WS-driven) or useActiveCollaboratorsSnapshot
 * in features/pages/fetch-active-page-collaborators (GraphQL polling).
 *
 * Cache: staleTime 60s — changes only when add/remove mutations run,
 * which already invalidate pageKeys.collaborators(pageId).
 *
 * @layer Features
 */
export function usePageCollaborators(
  pageId: string,
  options?: Omit<
    UseQueryOptions<GetPageCollaboratorsQuery, Error, Array<PageCollaborator>>,
    'queryKey' | 'queryFn' | 'select'
  >,
) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: pageKeys.collaborators(pageId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(GET_PAGE_COLLABORATORS, { pageId })
    },
    select: (data) => data.getPageCollaborators as Array<PageCollaborator>,
    enabled: !!pageId,
    staleTime: 60_000, // 1 min — mutation invalidation is the primary refresh
    ...options,
  })
}
