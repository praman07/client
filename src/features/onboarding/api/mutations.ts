import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { onboardingKeys } from './query-keys'
import { createGqlClient } from '@/shared/api/graphql-client'
import { gql } from '@/gql'

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
