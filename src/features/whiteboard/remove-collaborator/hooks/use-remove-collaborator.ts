import { useMutation, useQueryClient } from '@tanstack/react-query'
import { REMOVE_BOARD_COLLABORATOR } from '../api'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { boardKeys } from '@/entities/whiteboard-board'

export function useRemoveCollaborator() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      boardId,
      userId,
    }: {
      boardId: string
      userId: string
    }) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(REMOVE_BOARD_COLLABORATOR, { boardId, userId })
    },
    onMutate: async ({ boardId }) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({
        queryKey: boardKeys.collaborators(boardId),
      })

      // Get current data for rollback
      const previous = queryClient.getQueryData(
        boardKeys.collaborators(boardId),
      )

      return { previous }
    },
    onError: (_err, { boardId }, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(
          boardKeys.collaborators(boardId),
          context.previous,
        )
      }
    },
    onSettled: (_data, _error, { boardId }) => {
      // Invalidate to refetch
      queryClient.invalidateQueries({
        queryKey: boardKeys.collaborators(boardId),
      })
      queryClient.invalidateQueries({
        queryKey: boardKeys.detail(boardId),
      })
    },
  })
}
