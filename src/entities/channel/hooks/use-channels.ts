import { useQuery } from '@tanstack/react-query'
import { GET_CHANNELS, channelKeys } from '../api'
import { useAppSelector, useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'
import { selectCurrentWorkspaceId } from '@/entities/workspace'
import { selectCurrentProject } from '@/entities/project'

export function useChannels() {
  const { getToken } = useAuth()
  const workspaceId = useAppSelector(selectCurrentWorkspaceId)
  const currentProject = useAppSelector(selectCurrentProject)
  const projectId = currentProject?.id

  return useQuery({
    queryKey: channelKeys.list(workspaceId || '', projectId || ''),
    queryFn: async () => {
      if (!workspaceId) throw new Error('No workspace selected')
      if (!projectId) throw new Error('No project selected')

      const token = await getToken()
      const client = GqlClient(token)

      return client.request(GET_CHANNELS, { workspaceId, projectId })
    },
    enabled: !!workspaceId && !!projectId,
  })
}
