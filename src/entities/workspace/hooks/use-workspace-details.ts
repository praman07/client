import { useQuery } from '@tanstack/react-query'
import { workspaceKeys } from '../api/query-keys'
import { GET_WORKSPACE_DETAILS, WORKSPACE_SETTINGS_FRAGMENT } from '../api/fragments'
import { useAuth } from '@/shared/hooks'
import { GqlClient, getFragmentData } from '@/shared/api'

export function useWorkspaceDetails(workspaceId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: workspaceKeys.settings(workspaceId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const result = await client.request(GET_WORKSPACE_DETAILS, { workspaceId })
      return getFragmentData(WORKSPACE_SETTINGS_FRAGMENT, result.workspaceById)
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  })
}