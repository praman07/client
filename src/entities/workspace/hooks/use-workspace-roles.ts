import { useQuery } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAppSelector } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks'
import { selectCurrentWorkspace } from '@/entities/workspace'
import { gql } from '@/gql'

const GET_WORKSPACE_ROLES = gql(`
  query GetWorkspaceRoles($workspaceId: ID!) {
    workspaceRoles(workspaceId: $workspaceId) {
      id
      name
      rank
    }
  }
`)

const workspaceRoleKeys = {
  all: ['workspace-roles'] as const,
  list: (workspaceId: string) => [...workspaceRoleKeys.all, workspaceId] as const,
}

export function useWorkspaceRoles() {
  const { getToken } = useAuth()
  const workspace = useAppSelector(selectCurrentWorkspace)

  return useQuery({
    queryKey: workspaceRoleKeys.list(workspace?.id ?? ''),
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
