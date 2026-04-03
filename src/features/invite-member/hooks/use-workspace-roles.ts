import { useQuery } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAppSelector, useAuth } from '@/shared/hooks'
import { selectCurrentWorkspace } from '@/entities/workspace'
import { GET_WORKSPACE_ROLES } from '../api'

export function useWorkspaceRoles() {
  const { getToken } = useAuth()
  const workspace = useAppSelector(selectCurrentWorkspace)

  return useQuery({
    queryKey: ['workspace-roles', workspace?.id],
    enabled: !!workspace?.id,
    staleTime: 5 * 60 * 1000, // 5 min — roles rarely change
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(GET_WORKSPACE_ROLES, {
        workspaceId: workspace!.id,
      })
      return data.workspaceRoles
    },
  })
}
