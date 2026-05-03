import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UPDATE_PAGE_DETAILS } from '../api/fragments'
import type { Page } from '@/entities/page'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { pageKeys } from '@/entities/page'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:update-page-details-hook')

export interface UpdatePageDetailsVariables {
  pageId: string
  /** Required for optimistic update cache targeting — not sent to server */
  projectId: string
  emoji?: string | null
  coverImageUrl?: string | null
}

/**
 * Mutation hook for updating page emoji and/or coverImageUrl.
 *
 * Optimistic update pattern (mirrors useRenamePage exactly):
 *  - onMutate:   snapshot + apply icon/coverUrl changes to projectPages cache tree
 *  - onError:    rollback to snapshot
 *  - onSettled:  invalidate to sync with server
 *
 * Cache shape note:
 *   useProjectPages uses `select` to transform the raw GQL response into Array<Page>.
 *   TanStack Query stores the SELECTED data in the cache when setQueryData is called
 *   with Array<Page>. We always read/write Array<Page> here to stay consistent with
 *   the useRenamePage pattern (which works the same way).
 *
 * @layer Features
 */
export function useUpdatePageDetails() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageId, emoji, coverImageUrl }: UpdatePageDetailsVariables) => {
      log.info('Updating page details', { pageId, emoji, coverImageUrl })
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      return GqlClient(token).request(UPDATE_PAGE_DETAILS, {
        input: { pageId, emoji, coverImageUrl },
      })
    },

    onMutate: async ({ pageId, projectId, emoji, coverImageUrl }) => {
      await queryClient.cancelQueries({ queryKey: pageKeys.projectPages(projectId) })

      const snapshot = queryClient.getQueryData<Array<Page>>(pageKeys.projectPages(projectId))

      queryClient.setQueryData<Array<Page>>(
        pageKeys.projectPages(projectId),
        (old) => {
          if (!old || !Array.isArray(old)) return old
          return applyPageDetailsUpdate(old, pageId, { emoji, coverImageUrl })
        },
      )

      log.debug('Optimistic update applied', { pageId, emoji, coverImageUrl })
      return { snapshot }
    },

    onError: (err, { pageId, projectId }, context) => {
      log.error('Update failed — rolling back', { pageId, err })
      if (context?.snapshot !== undefined) {
        queryClient.setQueryData(pageKeys.projectPages(projectId), context.snapshot)
      }
    },

    onSettled: (_data, _err, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: pageKeys.projectPages(projectId) })
    },
  })
}

/**
 * Pure recursive tree updater.
 * Applies icon and/or coverUrl to the matching page node at any depth.
 * Uses Array.isArray guard to protect against non-array children during cache warm-up.
 */
function applyPageDetailsUpdate(
  pages: Array<Page>,
  pageId: string,
  fields: { emoji?: string | null; coverImageUrl?: string | null },
): Array<Page> {
  return pages.map((p) => {
    if (p.id === pageId) {
      return {
        ...p,
        ...(fields.emoji !== undefined && { icon: fields.emoji }),
        ...(fields.coverImageUrl !== undefined && { coverUrl: fields.coverImageUrl }),
      }
    }
    if (Array.isArray(p.children) && p.children.length > 0) {
      return { ...p, children: applyPageDetailsUpdate(p.children, pageId, fields) }
    }
    return p
  })
}
