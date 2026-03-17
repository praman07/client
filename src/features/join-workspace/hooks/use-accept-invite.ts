import { useMutation } from '@tanstack/react-query'
import { ACCEPT_WORKSPACE_INVITE } from '../api'
import { useAuth, useUser } from '@/shared/hooks'
import { GqlClient } from '@/shared/api/graphql-client'
import { useSyncUser } from '@/features/onboarding'

export function useAcceptInvite() {
  const { getToken, userId } = useAuth()
  const { user } = useUser()
  const { mutateAsync: syncUser } = useSyncUser()

  return useMutation({
    mutationFn: async (token: string) => {
      // 1. Validation
      if (!userId || !user?.primaryEmailAddress?.emailAddress) {
        throw new Error('You must be logged in to join.')
      }

      // 2. Race Condition Fix: Ensure User Exists in DB
      // The user just signed up/in via Clerk, but the webhook might lag.
      // We manually sync first to guarantee the record exists.
      await syncUser({
        clerkId: userId,
        email: user.primaryEmailAddress.emailAddress,
        fullName: user.fullName || '',
        avatarUrl: user.imageUrl,
      })

      // 3. Accept Invite
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
