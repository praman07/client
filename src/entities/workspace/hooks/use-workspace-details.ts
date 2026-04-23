import { useQuery } from '@tanstack/react-query'
import { gql } from '@/gql'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'
import { workspaceKeys } from '../api/query-keys'

const WORKSPACE_DETAILS_FRAGMENT = gql`
  fragment WorkspaceDetailsFields on Workspace {
    id
    name
    slug
    logoUrl
  }
`

const GET_WORKSPACE_DETAILS = gql`
  query GetWorkspaceDetails($workspaceId: ID!) {
    workspaceById(workspaceId: $workspaceId) {
      ...WorkspaceDetailsFields
    }
  }
`

export function useWorkspaceDetails(workspaceId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: workspaceKeys.settings(workspaceId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const result = await client.request(GET_WORKSPACE_DETAILS, { workspaceId })
      return result.workspaceById
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  })
}