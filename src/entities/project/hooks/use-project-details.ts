import { useQuery } from '@tanstack/react-query'
import { gql } from '@/gql'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'
import { projectKeys } from '../api/query-keys'

const PROJECT_DETAILS_FRAGMENT = gql`
  fragment ProjectDetailsFields on Project {
    id
    name
    key
    logoUrl
  }
`

const GET_PROJECT_DETAILS = gql`
  query GetProjectDetails($projectId: ID!) {
    project(id: $projectId) {
      ...ProjectDetailsFields
    }
  }
`

export function useProjectDetails(projectId: string, workspaceId?: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: projectKeys.detail(workspaceId ?? '', projectId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const result = await client.request(GET_PROJECT_DETAILS, { projectId })
      return result.project
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  })
}