import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { pageKeys } from '@/entities/page'
import type { Page } from '@/entities/page'
import { UNARCHIVE_PAGE } from '../api/fragments'
import { setPageArchived } from './use-archive-page'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:unarchive-page-hook')

export interface UnarchivePageVariables {
  pageId: string
  /** Required for optimistic update cache targeting — not sent to server */
  projectId: string
}

/**
 * Mutation hook for unarchiving (restoring) a page.
 *
 * Server guard: fails with CONFLICT if the page's parent is still archived.
 * In that case the optimistic update is rolled back and a toast is shown.
 *
 * Optimistic update: sets isArchived: false in projectPages tree immediately.
 * onError: rolls back to snapshot.
 * onSettled: always invalidates to sync with server truth.
 *
 * @layer Features
 */
export function useUnarchivePage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageId }: UnarchivePageVariables) => {
      log.info('Unarchiving page', { pageId })
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      return GqlClient(token).request(UNARCHIVE_PAGE, { input: { pageId } })
    },

    onMutate: async ({ pageId, projectId }) => {
      await queryClient.cancelQueries({
        queryKey: pageKeys.projectPages(projectId),
      })
      const snapshot = queryClient.getQueryData<Page[]>(
        pageKeys.projectPages(projectId),
      )

      queryClient.setQueryData<Page[]>(
        pageKeys.projectPages(projectId),
        (old) => (old ? setPageArchived(old, pageId, false) : old),
      )

      log.debug('Optimistic unarchive applied', { pageId })
      return { snapshot }
    },

    onError: (err, { pageId, projectId }, context) => {
      log.error('Unarchive failed — rolling back', { pageId, err })
      if (context?.snapshot !== undefined) {
        queryClient.setQueryData(
          pageKeys.projectPages(projectId),
          context.snapshot,
        )
      }
    },

    onSettled: (_data, _err, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: pageKeys.projectPages(projectId),
      })
    },
  })
}
