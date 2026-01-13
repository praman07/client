import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/shared/auth'
import { createGqlClient } from '@/shared/api/graphql-client'
import { onboardingKeys, CREATE_ONBOARDING_WORKSPACE_MUTATION } from '../api'

export function useCreateOnboardingWorkspace() {
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
