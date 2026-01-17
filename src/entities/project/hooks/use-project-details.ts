import { useQuery } from '@tanstack/react-query'
import { projectKeys } from '../api/query-keys'
import { GET_PROJECT } from '../api'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api'

export function useProjectDetails(id: string) {
  const { getToken, isSignedIn } = useAuth()

  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(GET_PROJECT, { id })
    },
    enabled: !!id && !!isSignedIn,
  })
}
