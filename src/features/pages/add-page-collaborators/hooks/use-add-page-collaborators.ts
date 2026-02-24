import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { pageKeys } from '@/entities/page'
import { ADD_PAGE_COLLABORATORS } from '../api/fragments'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:add-page-collaborators-hook')

import { type PageRole } from '@/gql/graphql'

export interface AddPageCollaboratorsVariables {
  pageId: string
  collaborators: Array<{
    userId: string
    role: PageRole
  }>
}

/**
 * Mutation hook for adding (or updating roles of) page collaborators.
 *
 * Upsert-semantics: can be used for both inviting new users and changing roles.
 * No optimistic update — upsert results are unpredictable locally.
 * Invalidates collaborators cache on success to re-fetch the accurate list.
 *
 * @layer Features
 */
export function useAddPageCollaborators() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      pageId,
      collaborators,
    }: AddPageCollaboratorsVariables) => {
      log.info('Adding collaborators', { pageId, count: collaborators.length })
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      return GqlClient(token).request(ADD_PAGE_COLLABORATORS, {
        input: { pageId, collaborators },
      })
    },

    onSuccess: (_data, { pageId }) => {
      log.info('Collaborators added — invalidating cache', { pageId })
      queryClient.invalidateQueries({
        queryKey: pageKeys.collaborators(pageId),
      })
    },

    onError: (err, { pageId }) => {
      log.error('Failed to add collaborators', { pageId, err })
    },
  })
}
