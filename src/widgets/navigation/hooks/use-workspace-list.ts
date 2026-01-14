import { useQuery } from '@tanstack/react-query'
import { GET_MY_WORKSPACES_QUERY, navigationKeys } from '../api'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'

export function useWorkspaceList() {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: navigationKeys.myWorkspaces(),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(GET_MY_WORKSPACES_QUERY)
    },
    throwOnError: true,
  })
}
