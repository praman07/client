import { useMutation } from '@tanstack/react-query'
import { ACCEPT_WORKSPACE_INVITE } from '../api'
import { useAuth, useUser } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'

export function useAcceptInvite() {
  const { getToken, userId } = useAuth()
  const { user } = useUser()

  return useMutation({
    mutationFn: async (token: string) => {
      if (!userId || !user?.primaryEmailAddress?.emailAddress) {
        throw new Error('You must be logged in to join.')
      }

      const authToken = await getToken()
      const client = GqlClient(authToken)
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
