import { useQuery } from '@tanstack/react-query'
import { GET_PROJECT_BY_SLUG } from '../api'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'

export function useProjectBySlug(workspaceId: string, slug: string) {
  const { getToken, isSignedIn } = useAuth()

  return useQuery({
    queryKey: ['project', workspaceId, slug],
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(GET_PROJECT_BY_SLUG, {
        workspaceId,
        slug,
      })
    },
    enabled: !!workspaceId && !!slug && !!isSignedIn,
  })
}
