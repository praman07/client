import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UPDATE_BOARD_DESCRIPTION } from '../api'
import type { GetBoardQuery } from '@/gql/graphql'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { boardKeys } from '@/entities/whiteboard-board'

interface UpdateDescriptionVariables {
  boardId: string
  description?: string
}

export function useUpdateDescription() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      boardId,
      description,
    }: UpdateDescriptionVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(UPDATE_BOARD_DESCRIPTION, { boardId, description })
    },
    onMutate: async ({ boardId, description }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: boardKeys.detail(boardId) })

      // Snapshot previous value
      const previous = queryClient.getQueryData<GetBoardQuery>(
        boardKeys.detail(boardId),
      )

      // Optimistically update
      queryClient.setQueryData<GetBoardQuery>(
        boardKeys.detail(boardId),
        (old) =>
          old && {
            ...old,
            getBoard: old.getBoard
              ? { ...old.getBoard, description: description || null }
              : null,
          },
      )

      return { previous }
    },
    onError: (_err, { boardId }, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(boardKeys.detail(boardId), context.previous)
      }
    },
    onSettled: (_, __, { boardId }) => {
      // Refetch to sync with server
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
      // Invalidate lists so board list views show updated description
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() })
    },
  })
}
