import { useQuery } from '@tanstack/react-query'
import { useAuth, useClerk } from '@clerk/clerk-react'
import { onboardingKeys } from './query-keys'
import { createGqlClient } from '@/shared/api/graphql-client'
import { gql } from '@/gql'

// Inline Query
const ONBOARDING_STATUS_QUERY = gql(`
  query OnboardingStatus {
    onboardingStatus {
      hasUser
      hasWorkspace
      hasProject
      workspaceSlug
    }
  }
`)

export const useOnboardingStatusQuery = () => {
  const { user } = useClerk()
  // We need the token. useClerk doesn't give it directly in a convenient way for queries compared to useAuth
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
