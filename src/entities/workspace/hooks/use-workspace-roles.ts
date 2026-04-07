import { useQuery } from '@tanstack/react-query'
import { GET_WORKSPACE_ROLES_QUERY, workspaceKeys } from '../api'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAppSelector, useAuth  } from '@/shared/hooks'
import { selectCurrentWorkspace } from '@/entities/workspace'

export function useWorkspaceRoles() {
  const { getToken } = useAuth()
  const workspace = useAppSelector(selectCurrentWorkspace)

  return useQuery({
    queryKey: workspaceKeys.roles(workspace?.id ?? ''),
    enabled: !!workspace?.id,
    staleTime: 5 * 60 * 1000, // 5 min — roles rarely change
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(GET_WORKSPACE_ROLES_QUERY, {
        workspaceId: workspace!.id,
      })
      return data.workspaceRoles
    },
  })
}
