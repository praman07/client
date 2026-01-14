import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CREATE_ONBOARDING_WORKSPACE_MUTATION, onboardingKeys } from '../api'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'

export function useCreateOnboardingWorkspace() {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async (variables?: { idempotencyKey?: string }) => {
      const token = await getToken()
      const client = GqlClient(token)
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
