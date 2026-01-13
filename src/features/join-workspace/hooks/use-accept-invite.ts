import { useMutation } from '@tanstack/react-query'
import { useAuth, useUser } from '@/shared/auth'
import { createGqlClient } from '@/shared/api/graphql-client'
import { ACCEPT_WORKSPACE_INVITE } from '../api'

export function useAcceptInvite() {
  const { getToken, userId } = useAuth()
  const { user } = useUser()

  return useMutation({
    mutationFn: async (token: string) => {
      if (!userId || !user?.primaryEmailAddress?.emailAddress) {
        throw new Error('You must be logged in to join.')
      }

      const authToken = await getToken()
      const client = createGqlClient(authToken)
      return client.request(ACCEPT_WORKSPACE_INVITE, {
        input: {
          token,
          userId,
          userEmail: user.primaryEmailAddress.emailAddress,
        },
      })
    },
  })
}
