import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CREATE_BOARD } from '../api'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { boardKeys } from '@/entities/whiteboard-board'

interface CreateBoardInput {
  workspaceId: string
  projectId?: string
  title: string
  description?: string
  collaboratorIds?: Array<string>
}

export function useCreateBoard() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateBoardInput) => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      return client.request(CREATE_BOARD, { input })
    },
    onSuccess: (_data, variables) => {
      // Invalidate board list for workspace
      queryClient.invalidateQueries({
        queryKey: boardKeys.list(variables.workspaceId),
      })
    },
  })
}
