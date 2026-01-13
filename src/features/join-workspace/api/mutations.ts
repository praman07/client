import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuth, useUser } from '@/shared/auth'
import { createGqlClient } from '@/shared/api/graphql-client'
import { gql } from '@/gql'

export const ACCEPT_WORKSPACE_INVITE = gql(`
  mutation AcceptWorkspaceInvite($input: AcceptInviteInput!) {
    acceptWorkspaceInvite(input: $input) {
      success
      message
      workspaceSlug
    }
  }
`)

export const useAcceptWorkspaceInviteMutation = () => {
  const navigate = useNavigate()
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
    onSuccess: (data) => {
      if (data.acceptWorkspaceInvite.success) {
        toast.success(data.acceptWorkspaceInvite.message)
        navigate({
          to: '/workspace/$workspaceSlug',
          params: { workspaceSlug: data.acceptWorkspaceInvite.workspaceSlug },
        })
      }
    },
    onError: (error: any) => {
      // FE-ERR-01: Branch on error code
      const code = error?.response?.errors?.[0]?.extensions?.code

      if (error.message === 'You must be logged in to join.') {
        toast.error(error.message)
        return
      }

      if (
        code === 'WORKSPACE_ONBOARDING_ALREADY_EXISTS' ||
        code === 'ALREADY_WORKSPACE_MEMBER'
      ) {
        toast.error('You are already a member of this workspace')
        navigate({ to: '/' })
        return
      }

      toast.error('Failed to join workspace. Please try again.')
    },
  })
}
