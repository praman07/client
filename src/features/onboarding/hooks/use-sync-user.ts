import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { onboardingKeys, SYNC_USER_MUTATION } from '../api'

export function useSyncUser() {
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
      const client = GqlClient(token)
      return client.request(SYNC_USER_MUTATION, variables)
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: onboardingKeys.status() }),
  })
}
