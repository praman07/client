import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ADD_BOARD_COLLABORATORS } from '../api'
import type { AddCollaboratorsFormData } from '../model'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { boardKeys } from '@/entities/whiteboard-board'

export function useAddCollaborators() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ boardId, userIds }: AddCollaboratorsFormData) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(ADD_BOARD_COLLABORATORS, { boardId, userIds })
    },
    onSuccess: (_data, { boardId }) => {
      // Invalidate collaborators list
      queryClient.invalidateQueries({
        queryKey: boardKeys.collaborators(boardId),
      })

      // Invalidate board detail
      queryClient.invalidateQueries({
        queryKey: boardKeys.detail(boardId),
      })
    },
  })
}
