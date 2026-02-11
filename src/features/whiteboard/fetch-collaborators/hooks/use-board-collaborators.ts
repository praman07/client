import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { boardKeys } from '@/entities/whiteboard-board'
import { GET_BOARD_COLLABORATORS } from '../api/fragments'
import type { GetBoardCollaboratorsQuery } from '@/gql/graphql'

/**
 * Fetch list of users with access to a board (DB collaborators)
 *
 * @example
 * const { data } = useBoardCollaborators('board_abc123')
 * const collaborators = data?.boardCollaborators ?? []
 */
export function useBoardCollaborators(
  boardId: string,
  options?: Omit<
    UseQueryOptions<GetBoardCollaboratorsQuery>,
    'queryKey' | 'queryFn'
  >,
) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: boardKeys.collaborators(boardId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(GET_BOARD_COLLABORATORS, { boardId })
    },
    enabled: !!boardId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}
