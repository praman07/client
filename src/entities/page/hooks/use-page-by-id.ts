/**
 * usePageById — Entity hook to reactively read a single page from the
 * projectPages cache by `pageId`.
 *
 * Pattern: useSyncExternalStore + queryClient.getQueryCache().subscribe()
 *
 * Why NOT useQuery here:
 *   - useQuery always requires a queryFn — even with staleTime: Infinity.
 *   - The projectPages data is already managed by the sidebar's useProjectPages hook.
 *   - We want a pure cache-read that re-renders on cache updates, no extra fetch.
 *
 * useSyncExternalStore is the correct React 18 primitive for subscribing to
 * an external mutable store (TanStack Query cache qualifies as one).
 *
 * @layer Entity
 */

import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useSyncExternalStore } from 'react'
import { pageKeys } from '../api/query-keys'
import type { Page } from '../model/types'

function findPageInTree(nodes: Array<Page>, pageId: string): Page | null {
  for (const node of nodes) {
    if (node.id === pageId) return node
    if (Array.isArray(node.children) && node.children.length > 0) {
      const found = findPageInTree(node.children, pageId)
      if (found) return found
    }
  }
  return null
}

export function usePageById(pageId: string, projectId: string): Page | null {
  const queryClient = useQueryClient()
  const queryKey = pageKeys.projectPages(projectId)

  // Subscribe to the full query cache — re-renders whenever any cache entry updates.
  const rawData = useSyncExternalStore(
    (onStoreChange) => queryClient.getQueryCache().subscribe(onStoreChange),
    () => queryClient.getQueryData(queryKey),
    () => undefined,
  )

  return useMemo(() => {
    if (!rawData) return null

    // queryClient.getQueryData() always returns the raw queryFn result.
    // useProjectPages uses select: (data) => data.getProjectPages — this is
    // applied per-observer only and never stored in the cache.
    // So we must handle BOTH shapes:
    //   1. { getProjectPages: Page[] } — raw GQL response (initial fetch)
    //   2. Page[]                      — after setQueryData() from mutation hooks
    let pages: Array<Page> | undefined
    if (Array.isArray(rawData)) {
      pages = rawData as Array<Page>
    } else if (
      typeof rawData === 'object' &&
      'getProjectPages' in (rawData) &&
      Array.isArray((rawData as { getProjectPages: unknown }).getProjectPages)
    ) {
      pages = (rawData as { getProjectPages: Array<Page> }).getProjectPages
    }

    if (!pages) return null
    return findPageInTree(pages, pageId)
  }, [rawData, pageId])
}
