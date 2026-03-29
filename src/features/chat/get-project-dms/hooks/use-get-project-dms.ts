import { useQuery } from '@tanstack/react-query'
import { GET_PROJECT_DMS } from '../api/fragments'
import { projectDmsKeys } from '../api/query-keys'
import { GqlClient } from '@/shared/api'
import { useAppSelector, useAuth  } from '@/shared/hooks'
import { selectCurrentWorkspaceId } from '@/entities/workspace'
import { selectCurrentProject } from '@/entities/project'

/**
 * Fetches all 1:1 DMs the current user is a member of in the active project.
 * Each item includes the other participant's profile (name, avatar) so the
 * sidebar can render without additional round-trips.
 *
 * @layer Feature — read-only query, consumed by chat-sidebar widget
 */
export function useGetProjectDms() {
  const { getToken, isSignedIn } = useAuth()
  const workspaceId = useAppSelector(selectCurrentWorkspaceId)
  const project = useAppSelector(selectCurrentProject)
  const projectId = project?.id

  return useQuery({
    queryKey: projectDmsKeys.list(projectId ?? ''),
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(GET_PROJECT_DMS, {
        projectId: projectId!,
        workspaceId: workspaceId!,
      })
    },
    enabled: !!projectId && !!workspaceId && !!isSignedIn,
    staleTime: 30_000,
  })
}
