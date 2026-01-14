import { useQuery } from '@tanstack/react-query'
import { GET_WORKSPACE_MEMBERS, workspaceMemberKeys } from '../api'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'

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
