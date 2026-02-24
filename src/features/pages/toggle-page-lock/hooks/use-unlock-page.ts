import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { pageKeys } from '@/entities/page'
import type { Page } from '@/entities/page'
import { UNLOCK_PAGE } from '../api/fragments'
import { setPageLocked } from './use-lock-page'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:unlock-page-hook')

export interface UnlockPageVariables {
  pageId: string
  /** Required for optimistic update cache targeting — not sent to server */
  projectId: string
}

/**
 * Mutation hook for unlocking a page.
 *
 * Access: lock owner OR workspace ADMIN (enforced server-side).
 *
 * Optimistic update: sets isLocked: false in projectPages tree immediately.
 * onError: rolls back to snapshot.
 * onSettled: invalidates to sync with server truth.
 *
 * @layer Features
 */
export function useUnlockPage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageId }: UnlockPageVariables) => {
      log.info('Unlocking page', { pageId })
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      return GqlClient(token).request(UNLOCK_PAGE, { input: { pageId } })
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
        (old) => (old ? setPageLocked(old, pageId, false) : old),
      )

      log.debug('Optimistic unlock applied', { pageId })
      return { snapshot }
    },

    onError: (err, { pageId, projectId }, context) => {
      log.error('Unlock failed — rolling back', { pageId, err })
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
