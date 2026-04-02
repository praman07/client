import { useQuery } from '@tanstack/react-query'
import { ONBOARDING_STATUS_QUERY, onboardingKeys } from '../api'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { useUser } from '@/entities/user'

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
    retry: true,
  })
}
