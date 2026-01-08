import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth, useClerk } from '@clerk/clerk-react'
import { createGqlClient } from '@/shared/api/graphql-client'
import { gql } from '@/gql'
import { onboardingKeys } from '@/features/onboarding/api/query-keys'

// Inline Queries
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

const SYNC_USER_MUTATION = gql(`
  mutation SyncUser(
    $clerkId: String!
    $email: String!
    $fullName: String
    $avatarUrl: String
  ) {
    syncUser(
      clerkId: $clerkId
      email: $email
      fullName: $fullName
      avatarUrl: $avatarUrl
    ) {
      id
    }
  }
`)

const CREATE_ONBOARDING_WORKSPACE_MUTATION = gql(`
  mutation CreateOnboardingWorkspace {
    createOnboardingWorkspace {
      id
      slug
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

export const useSyncUserMutation = () => {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (variables: {
      clerkId: string
      email: string
      fullName?: string
      avatarUrl?: string
    }) => {
      const token = await getToken()
      const client = createGqlClient(token)
      return client.request(SYNC_USER_MUTATION, variables)
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: onboardingKeys.status() }),
  })
}

export const useCreateOnboardingWorkspaceMutation = () => {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (variables?: { idempotencyKey?: string }) => {
      const token = await getToken()
      const client = createGqlClient(token)
      const headers = variables?.idempotencyKey
        ? { 'X-Idempotency-Key': variables.idempotencyKey }
        : undefined

      // Header handling needs to be done via client config or request wrapper if internal client doesn't support per-request headers easily
      // GraphQLClient request method accepts headers as 3rd arg
      return client.request(
        CREATE_ONBOARDING_WORKSPACE_MUTATION,
        undefined,
        headers,
      )
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: onboardingKeys.status() }),
  })
}
