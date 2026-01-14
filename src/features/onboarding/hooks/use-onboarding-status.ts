import { useQuery } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { onboardingKeys, ONBOARDING_STATUS_QUERY } from '../api'
import { useAuth, useUser } from '@/shared/hooks'

export function useOnboardingStatus() {
  const { user } = useUser()
  const { getToken } = useAuth()

  return useQuery({
    queryKey: onboardingKeys.status(),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      return client.request(ONBOARDING_STATUS_QUERY)
    },
    enabled: !!user,
    refetchInterval: (query) => {
      const data = query.state.data
      if (data && !data.onboardingStatus.hasUser) return 1000
      return false
    },
    retry: true,
  })
}
