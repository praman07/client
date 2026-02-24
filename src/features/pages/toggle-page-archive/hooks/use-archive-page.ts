import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { pageKeys } from '@/entities/page'
import type { Page } from '@/entities/page'
import { ARCHIVE_PAGE } from '../api/fragments'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:archive-page-hook')

export interface ArchivePageVariables {
  pageId: string
  /** Required for optimistic update cache targeting — not sent to server */
  projectId: string
}

/**
 * Mutation hook for archiving a page.
 *
 * Optimistic update: sets isArchived: true in projectPages tree immediately.
 * onError: rolls back to snapshot.
 * onSettled: always invalidates to sync with server truth.
 *
 * @layer Features
 */
export function useArchivePage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageId }: ArchivePageVariables) => {
      log.info('Archiving page', { pageId })
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      return GqlClient(token).request(ARCHIVE_PAGE, { input: { pageId } })
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
        (old) => (old ? setPageArchived(old, pageId, true) : old),
      )

      log.debug('Optimistic archive applied', { pageId })
      return { snapshot }
    },

    onError: (err, { pageId, projectId }, context) => {
      log.error('Archive failed — rolling back', { pageId, err })
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

/**
 * Pure recursive tree helper — sets isArchived on the target page.
 * Exported for reuse in use-unarchive-page.ts.
 */
export function setPageArchived(
  pages: Page[],
  pageId: string,
  archived: boolean,
): Page[] {
  return pages.map((p) => {
    if (p.id === pageId) return { ...p, isArchived: archived }
    if (p.children?.length) {
      return {
        ...p,
        children: setPageArchived(p.children as Page[], pageId, archived),
      }
    }
    return p
  })
}
