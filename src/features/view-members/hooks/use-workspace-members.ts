import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { workspaceMemberKeys, GET_WORKSPACE_MEMBERS } from '../api'

export function useWorkspaceMembers(workspaceId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: workspaceMemberKeys.list(workspaceId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(GET_WORKSPACE_MEMBERS, { workspaceId })
    },
  })
}
