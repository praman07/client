import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UNLOCK_BOARD } from '../api'
import type { GetBoardQuery } from '@/gql/graphql'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { boardKeys } from '@/entities/whiteboard-board'

export function useUnlockBoard() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (boardId: string) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(UNLOCK_BOARD, { boardId })
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
              ? { ...old.getBoard, isLocked: false }
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
      toast.error('Failed to unlock board')
    },
    onSuccess: () => {
      toast.success('Board unlocked')
    },
    onSettled: (_, __, boardId) => {
      // Refetch detail + all list views so the lock badge refreshes on cards
      queryClient.invalidateQueries({ queryKey: boardKeys.detail(boardId) })
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() })
    },
  })
}
