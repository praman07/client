import { useQuery } from '@tanstack/react-query'
import { GET_USER_HOME_QUERY } from '../api/queries'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'

export const homeKeys = {
  dashboard: () => ['home', 'dashboard'] as const,
}

export function useUserHome() {
  const { getToken, isSignedIn } = useAuth()

  return useQuery({
    queryKey: homeKeys.dashboard(),
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(GET_USER_HOME_QUERY)
    },
    enabled: !!isSignedIn,
    staleTime: 2 * 60_000,
  })
}
