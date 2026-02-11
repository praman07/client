import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { boardKeys } from '@/entities/whiteboard-board'
import type { GetBoardQuery } from '@/gql/graphql'
import { RENAME_BOARD } from '../api'

interface RenameBoardVariables {
  boardId: string
  title: string
}

export function useRenameBoard() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ boardId, title }: RenameBoardVariables) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(RENAME_BOARD, { boardId, title })
    },
    onMutate: async ({ boardId, title }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: boardKeys.detail(boardId) })

      // Snapshot previous value
      const previous = queryClient.getQueryData<GetBoardQuery>(
        boardKeys.detail(boardId),
      )

      // Optimistically update
      queryClient.setQueryData<GetBoardQuery>(
        boardKeys.detail(boardId),
        (old) => {
          if (!old) return old
          return {
            ...old,
            getBoard: old.getBoard ? { ...old.getBoard, name: title } : null,
          }
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

      // Invalidate lists to update title
      queryClient.invalidateQueries({
        queryKey: ['whiteboard-board', 'list'],
      })
    },
  })
}
