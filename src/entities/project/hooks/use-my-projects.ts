import { useQuery } from '@tanstack/react-query'
import { LIST_PROJECTS_BY_USER, projectKeys } from '../api'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'

export function useMyProjects(workspaceId: string) {
  const { getToken, isSignedIn } = useAuth()

  return useQuery({
    queryKey: projectKeys.list(workspaceId),
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(LIST_PROJECTS_BY_USER, { workspaceId })
    },
    enabled: !!workspaceId && !!isSignedIn,
  })
}
