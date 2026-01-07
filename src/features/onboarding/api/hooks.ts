import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth, useClerk } from '@clerk/clerk-react'
import {
  CREATE_ONBOARDING_WORKSPACE_MUTATION,
  ONBOARDING_STATUS_QUERY,
  SYNC_USER_MUTATION,
} from './documents'
import type {
  CreateWorkspaceResponse,
  OnboardingStatusResponse,
  SyncUserResponse,
} from '../model/types'

import type { RequestDocument, Variables } from 'graphql-request'
import { authenticatedGraphQLRequest } from '@/shared/api/graphql-client'

// Helper for type-safe requests
/**
 * A wrapper around `authenticatedGraphQLRequest` that automatically injects the Clerk token.
 * Generics: <T> = Response Type.
 */
const useTypedRequest = () => {
  const { getToken } = useAuth()
  return async <T>(
    document: RequestDocument,
    variables?: Variables,
    headers?: Record<string, string>,
  ) => {
    const token = await getToken()
    return authenticatedGraphQLRequest<T, Variables>(
      document,
      token,
      variables,
      {
        headers,
      },
    )
  }
}

export const useOnboardingStatusQuery = () => {
  const { user } = useClerk()
  const request = useTypedRequest()

  return useQuery<OnboardingStatusResponse>({
    queryKey: ['onboardingStatus'],
    queryFn: () => request<OnboardingStatusResponse>(ONBOARDING_STATUS_QUERY),
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
  const request = useTypedRequest()

  return useMutation({
    mutationFn: (variables: {
      clerkId: string
      email: string
      fullName?: string
      avatarUrl?: string
    }) => request<SyncUserResponse>(SYNC_USER_MUTATION, variables),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['onboardingStatus'] }),
  })
}

export const useCreateOnboardingWorkspaceMutation = () => {
  const queryClient = useQueryClient()
  const request = useTypedRequest()

  return useMutation({
    mutationFn: (variables?: { idempotencyKey?: string }) =>
      request<CreateWorkspaceResponse>(
        CREATE_ONBOARDING_WORKSPACE_MUTATION,
        undefined,
        variables?.idempotencyKey
          ? { 'X-Idempotency-Key': variables.idempotencyKey }
          : undefined,
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['onboardingStatus'] }),
  })
}
