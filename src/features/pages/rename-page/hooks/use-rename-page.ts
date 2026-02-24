import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { pageKeys } from '@/entities/page'
import type { Page } from '@/entities/page'
import { RENAME_PAGE } from '../api/fragments'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:rename-page-hook')

export interface RenamePageVariables {
  pageId: string
  /** Required for optimistic update cache targeting — not sent to server */
  projectId: string
  title: string
}

/**
 * Mutation hook for renaming a page.
 *
 * Optimistic update pattern:
 *  - onMutate:   snapshot + immediately update title in projectPages cache
 *  - onError:    rollback to snapshot + log
 *  - onSettled:  always invalidate to sync with server truth
 *
 * @layer Features
 */
export function useRenamePage() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageId, title }: RenamePageVariables) => {
      log.info('Renaming page', { pageId, title })
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      return GqlClient(token).request(RENAME_PAGE, {
        input: { pageId, title },
      })
    },

    onMutate: async ({ pageId, projectId, title }) => {
      // Cancel in-flight refetches to avoid race conditions
      await queryClient.cancelQueries({
        queryKey: pageKeys.projectPages(projectId),
      })

      // Snapshot current tree for rollback
      const snapshot = queryClient.getQueryData<Page[]>(
        pageKeys.projectPages(projectId),
      )

      // Optimistically update title in the nested page tree
      queryClient.setQueryData<Page[]>(
        pageKeys.projectPages(projectId),
        (old) => (old ? updatePageTitle(old, pageId, title) : old),
      )

      log.debug('Optimistic update applied', { pageId, title })
      return { snapshot }
    },

    onError: (err, { pageId, projectId }, context) => {
      log.error('Rename failed — rolling back', { pageId, err })
      if (context?.snapshot !== undefined) {
        queryClient.setQueryData(
          pageKeys.projectPages(projectId),
          context.snapshot,
        )
      }
    },

    onSettled: (_data, _err, { projectId }) => {
      // Sync with server whether mutation succeeded or failed
      queryClient.invalidateQueries({
        queryKey: pageKeys.projectPages(projectId),
      })
    },
  })
}

/**
 * Pure recursive tree updater.
 * Traverses nested children to find and update the target page title.
 */
function updatePageTitle(pages: Page[], pageId: string, title: string): Page[] {
  return pages.map((p) => {
    if (p.id === pageId) return { ...p, title }
    if (p.children?.length) {
      return {
        ...p,
        children: updatePageTitle(p.children as Page[], pageId, title),
      }
    }
    return p
  })
}
