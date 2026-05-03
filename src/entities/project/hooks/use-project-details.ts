import { useQuery } from '@tanstack/react-query'
import { projectKeys } from '../api/query-keys'
import { GET_PROJECT, PROJECT_FRAGMENT } from '../api/fragments'
import { useAuth } from '@/shared/hooks'
import { GqlClient, getFragmentData } from '@/shared/api'

export function useProjectDetails(projectId: string, workspaceId?: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: projectKeys.detail(workspaceId ?? '', projectId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const result = await client.request(GET_PROJECT, { id: projectId })
      return getFragmentData(PROJECT_FRAGMENT, result.project)
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  })
}