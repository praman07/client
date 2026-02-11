import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { boardKeys } from '@/entities/whiteboard-board'
import type { GetBoardQuery } from '@/gql/graphql'
import { ARCHIVE_BOARD } from '../api'

export function useArchiveBoard() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (boardId: string) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(ARCHIVE_BOARD, { boardId })
    },
    onMutate: async (boardId) => {
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
            getBoard: old.getBoard
              ? { ...old.getBoard, isArchived: true }
              : null,
          }
        },
      )

      return { previous }
    },
    onError: (_err, boardId, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(boardKeys.detail(boardId), context.previous)
      }
      toast.error('Failed to archive board')
    },
    onSuccess: () => {
      toast.success('Board archived')
    },
    onSettled: (_, __, boardId) => {
      // Refetch to sync with server
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) })

      // Invalidate lists to update archive status
      queryClient.invalidateQueries({
        queryKey: ['whiteboard-board', 'list'],
      })
    },
  })
}
