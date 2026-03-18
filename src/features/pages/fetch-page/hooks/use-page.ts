import { useQuery } from '@tanstack/react-query'
import { GET_PAGE } from '../api/fragments'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { Page } from '@/entities/page'
import type { GetPageQuery } from '@/gql/graphql'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { pageKeys } from '@/entities/page'

/**
 * Fetches full page metadata by pageId.
 *
 * Does NOT include Y.Doc content — use fetch-snapshot for that.
 * Does NOT include collaborators[] or children[] — those have dedicated queries.
 *
 * Cache: staleTime 0 — mutations (rename, lock, archive, delete) all invalidate
 * pageKeys.detail(pageId), so we rely on invalidation rather than timer.
 *
 * @layer Features
 */
export function usePage(
  pageId: string,
  options?: Omit<
    UseQueryOptions<GetPageQuery, Error, Page>,
    'queryKey' | 'queryFn' | 'select'
  >,
) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: pageKeys.detail(pageId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(GET_PAGE, { pageId })
    },
    select: (data) => data.getPage as Page,
    enabled: !!pageId,
    staleTime: 0, // mutations invalidate this key — no time-based staleness needed
    ...options,
  })
}
