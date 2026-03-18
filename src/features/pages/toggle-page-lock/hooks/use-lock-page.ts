import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LOCK_PAGE } from '../api/fragments'
import type { Page } from '@/entities/page'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { pageKeys } from '@/entities/page'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:lock-page-hook')

export interface LockPageVariables {
  pageId: string
  /** Required for optimistic update cache targeting — not sent to server */
  projectId: string
}

/**
 * Mutation hook for locking a page.
 *
 * Server uses Redis SET NX EX — idempotent for the lock owner, CONFLICT if
 * another user holds the lock.
 *
 * Optimistic update: sets isLocked: true in projectPages tree immediately.
 * onError: rolls back to snapshot.
 * onSettled: invalidates to sync with server truth.
 *
 * @layer Features
 */
export function useLockPage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageId }: LockPageVariables) => {
      log.info('Locking page', { pageId })
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      return GqlClient(token).request(LOCK_PAGE, { input: { pageId } })
    },

    onMutate: async ({ pageId, projectId }) => {
      await queryClient.cancelQueries({
        queryKey: pageKeys.projectPages(projectId),
      })
      const snapshot = queryClient.getQueryData<Array<Page>>(
        pageKeys.projectPages(projectId),
      )

      queryClient.setQueryData<Array<Page>>(
        pageKeys.projectPages(projectId),
        (old) => (old ? setPageLocked(old, pageId, true) : old),
      )

      log.debug('Optimistic lock applied', { pageId })
      return { snapshot }
    },

    onError: (err, { pageId, projectId }, context) => {
      log.error('Lock failed — rolling back', { pageId, err })
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

/** Pure recursive helper — sets isLocked on the target page in the nested tree */
export function setPageLocked(
  pages: Array<Page>,
  pageId: string,
  locked: boolean,
): Array<Page> {
  return pages.map((p) => {
    if (p.id === pageId) return { ...p, isLocked: locked }
    if (p.children.length) {
      return {
        ...p,
        children: setPageLocked(p.children, pageId, locked),
      }
    }
    return p
  })
}
