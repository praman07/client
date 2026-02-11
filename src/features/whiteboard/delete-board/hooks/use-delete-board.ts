import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { boardKeys } from '@/entities/whiteboard-board'
import { DELETE_BOARD } from '../api'

export function useDeleteBoard() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (boardId: string) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(DELETE_BOARD, { boardId })
    },
    onSuccess: (_data, boardId) => {
      // Remove detail cache immediately
      queryClient.removeQueries({
        queryKey: boardKeys.detail(boardId),
      })

      // Invalidate all lists that might contain this board
      // Note: workspaceId not available here, so invalidate all board lists
      queryClient.invalidateQueries({
        queryKey: ['whiteboard-board', 'list'],
      })
    },
  })
}
