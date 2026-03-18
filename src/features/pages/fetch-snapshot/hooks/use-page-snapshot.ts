import { useQuery } from '@tanstack/react-query'
import { GET_PAGE_SNAPSHOT } from '../api/fragments'
import { decodePageSnapshot } from '../lib/decode-snapshot'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { DecodedPageSnapshot } from '../lib/decode-snapshot'
import type { GetPageSnapshotQuery } from '@/gql/graphql'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { pageKeys } from '@/entities/page'

/**
 * Fetch the Y.Doc snapshot for a page.
 *
 * Workflow:
 *   1. Widget calls usePageSnapshot(pageId) → reacts Query fires getPageSnapshot GQL
 *   2. Returns { diff: Uint8Array, lastStreamId } on success
 *   3. Widget: Y.applyUpdate(ydoc, data.diff)
 *   4. Widget: subscribePage(pageId, data.lastStreamId) → WS gap-fill
 *
 * Cache strategy: never cache (gcTime: 0, refetchOnMount: 'always') — same as
 * useBoardSnapshot. Stale snapshots cause Y.Doc convergence failures.
 *
 * @layer Features
 */
export function usePageSnapshot(
  pageId: string,
  options?: Omit<
    UseQueryOptions<GetPageSnapshotQuery, Error, DecodedPageSnapshot>,
    'queryKey' | 'queryFn' | 'select'
  >,
) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: pageKeys.snapshot(pageId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return GqlClient(token).request(GET_PAGE_SNAPSHOT, { pageId })
    },
    select: (data) => decodePageSnapshot(pageId, data.getPageSnapshot),
    enabled: !!pageId,
    staleTime: 0,
    gcTime: 0, // never cache — prevent stale Y.Doc on remount
    refetchOnMount: 'always',
    ...options,
  })
}
