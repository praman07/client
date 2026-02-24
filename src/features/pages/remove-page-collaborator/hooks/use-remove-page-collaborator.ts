import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { pageKeys } from '@/entities/page'
import type { PageCollaborator } from '@/entities/page'
import { REMOVE_PAGE_COLLABORATOR } from '../api/fragments'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:remove-page-collaborator-hook')

export interface RemovePageCollaboratorVariables {
  pageId: string
  /** The collaborator user to remove */
  userId: string
}

/**
 * Mutation hook for removing a collaborator from a page.
 *
 * Server guard: FORBIDDEN if the target user is the page creator.
 *
 * Optimistic update: removes the user from the collaborators list immediately.
 * onError: rolls back to snapshot.
 * onSettled: invalidates to sync with server truth.
 *
 * @layer Features
 */
export function useRemovePageCollaborator() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ pageId, userId }: RemovePageCollaboratorVariables) => {
      log.info('Removing collaborator', { pageId, userId })
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      return GqlClient(token).request(REMOVE_PAGE_COLLABORATOR, {
        input: { pageId, userId },
      })
    },

    onMutate: async ({ pageId, userId }) => {
      await queryClient.cancelQueries({
        queryKey: pageKeys.collaborators(pageId),
      })
      const snapshot = queryClient.getQueryData<PageCollaborator[]>(
        pageKeys.collaborators(pageId),
      )

      // Optimistically remove from list
      queryClient.setQueryData<PageCollaborator[]>(
        pageKeys.collaborators(pageId),
        (old) => old?.filter((c) => c.userId !== userId),
      )

      log.debug('Optimistic remove applied', { pageId, userId })
      return { snapshot }
    },

    onError: (err, { pageId, userId }, context) => {
      log.error('Remove collaborator failed — rolling back', {
        pageId,
        userId,
        err,
      })
      if (context?.snapshot !== undefined) {
        queryClient.setQueryData(
          pageKeys.collaborators(pageId),
          context.snapshot,
        )
      }
    },

    onSettled: (_data, _err, { pageId }) => {
      queryClient.invalidateQueries({
        queryKey: pageKeys.collaborators(pageId),
      })
    },
  })
}
