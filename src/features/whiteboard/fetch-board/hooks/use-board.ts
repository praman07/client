import { useQuery } from '@tanstack/react-query'
import { GET_BOARD } from '../api/fragments'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { GetBoardQuery } from '@/gql/graphql'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { boardKeys } from '@/entities/whiteboard-board'

/**
 * Fetch a single whiteboard board by ID
 *
 * @example
 * const { data } = useBoard('board_abc123')
 * const board = data?.getBoard
 */
export function useBoard(
  boardId: string,
  options?: Omit<UseQueryOptions<GetBoardQuery>, 'queryKey' | 'queryFn'>,
) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: boardKeys.detail(boardId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(GET_BOARD, { boardId })
    },
    enabled: !!boardId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}
