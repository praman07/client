import { useQuery } from '@tanstack/react-query'
import { GET_ACTIVE_COLLABORATORS } from '../api'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { boardKeys } from '@/entities/whiteboard-board'

export function useActiveCollaborators(boardId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: boardKeys.collaborators(boardId),
    queryFn: async () => {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const client = GqlClient(token)
      const data = await client.request(GET_ACTIVE_COLLABORATORS, { boardId })

      return data.activeCollaborators
    },
    enabled: Boolean(boardId),
  })
}
