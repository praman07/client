import { useQuery } from '@tanstack/react-query'
import { workspaceKeys } from '@/entities/workspace'
import { GET_WORKSPACE_SETTINGS_QUERY } from '../api/fragments'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { useFragment } from '@/gql'
import { WORKSPACE_SETTINGS_FRAGMENT } from '@/entities/workspace'

export function useWorkspaceSettings(workspaceId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: workspaceKeys.settings(workspaceId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(GET_WORKSPACE_SETTINGS_QUERY, { workspaceId })
      
      return useFragment(WORKSPACE_SETTINGS_FRAGMENT, data.workspaceById)
    },
    enabled: !!workspaceId,
  })
}
