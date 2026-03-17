import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cleanBoardFromIndexedDB } from '../lib'
import { DELETE_BOARD } from '../api'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { boardKeys } from '@/entities/whiteboard-board'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:delete-board-hook')

export function useDeleteBoard() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (boardId: string) => {
      log.info('Deleting board', { boardId })
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(DELETE_BOARD, { boardId })
    },
    onSuccess: (_data, boardId) => {
      log.info('Board deleted — clearing cache and IndexedDB', { boardId })

      // 1. Remove detail + snapshot + collaborators cache immediately
      queryClient.removeQueries({ queryKey: boardKeys.detail(boardId) })
      queryClient.removeQueries({ queryKey: boardKeys.snapshot(boardId) })
      queryClient.removeQueries({ queryKey: boardKeys.collaborators(boardId) })

      // 2. Invalidate all board lists so they refresh
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() })

      // 3. Clean IndexedDB (non-blocking, non-fatal)
      cleanBoardFromIndexedDB(boardId)

      log.debug('Cache invalidation complete', { boardId })
    },
    onError: (err, boardId) => {
      log.error('Board deletion failed', { boardId, err })
    },
  })
}
