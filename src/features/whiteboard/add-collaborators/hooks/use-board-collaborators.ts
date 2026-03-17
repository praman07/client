import { useQuery } from '@tanstack/react-query'
import { GET_BOARD_COLLABORATORS } from '../api'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { boardKeys } from '@/entities/whiteboard-board'

/**
 * Fetch current board collaborators
 *
 * Used to determine which workspace members are already collaborators
 * when adding new collaborators to a board.
 */
export function useBoardCollaborators(boardId: string) {
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
  })
}
