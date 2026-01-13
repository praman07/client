import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/shared/auth'
import { createGqlClient } from '@/shared/api/graphql-client'
import { onboardingKeys, ONBOARDING_STATUS_QUERY } from '../api'
import { useUser } from '@clerk/clerk-react'

export function useOnboardingStatus() {
  const { user } = useUser()
  const { getToken } = useAuth()

  return useQuery({
    queryKey: onboardingKeys.status(),
    queryFn: async () => {
      const token = await getToken()
      const client = createGqlClient(token)
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
