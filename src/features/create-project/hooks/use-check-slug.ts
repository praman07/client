import { useQueryClient } from '@tanstack/react-query'
import { CHECK_SLUG, createProjectKeys } from '../api'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

interface UseCheckSlugProps {
  workspaceId: string
  slug: string
}

export function useCheckSlug() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const checkSlug = async ({ workspaceId, slug }: UseCheckSlugProps) => {
    return queryClient.fetchQuery({
      queryKey: createProjectKeys.checkSlug(workspaceId, slug),
      queryFn: async () => {
        const token = await getToken()
        return GqlClient(token).request(CHECK_SLUG, { workspaceId, slug })
      },
      staleTime: 1000 * 60, // Cache for 1 minute
    })
  }

  return { checkSlug }
}
