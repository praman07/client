import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DELETE_PAGE } from '../api/fragments'
import { cleanPageFromIndexedDB } from '../lib/clean-page-indexeddb'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { pageKeys } from '@/entities/page'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:delete-page-hook')

export interface DeletePageVariables {
  pageId: string
  workspaceId: string
  /** Required for targeted cache invalidation — not sent to server */
  projectId: string
}

/**
 * Mutation hook for soft-deleting a page.
 *
 * Server guards:
 *  - EDITOR role required
 *  - CONFLICT (409) if any WS subscriber is still active
 *
 * On success:
 *  1. Remove per-page cache entries immediately
 *  2. Invalidate project page tree so sidebar refreshes
 *  3. Purge Dexie offline queue + Y.Doc IDB store (non-blocking)
 *
 * @layer Features
 */
export function useDeletePage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageId, workspaceId }: DeletePageVariables) => {
      log.info('Deleting page', { pageId })
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      return GqlClient(token).request(DELETE_PAGE, {
        input: { pageId, workspaceId },
      })
    },

    onSuccess: (_data, { pageId, projectId }) => {
      log.info('Page deleted — clearing cache and IndexedDB', { pageId })

      // 1. Remove per-page cache entries immediately
      queryClient.removeQueries({ queryKey: pageKeys.detail(pageId) })
      queryClient.removeQueries({ queryKey: pageKeys.snapshot(pageId) })
      queryClient.removeQueries({ queryKey: pageKeys.collaborators(pageId) })

      // 2. Invalidate project page tree so sidebar refreshes
      queryClient.invalidateQueries({
        queryKey: pageKeys.projectPages(projectId),
      })

      // 3. Non-blocking IDB cleanup
      cleanPageFromIndexedDB(pageId)

      log.debug('Cache invalidation complete', { pageId })
    },

    onError: (err, { pageId }) => {
      log.error('Page deletion failed', { pageId, err })
    },
  })
}
