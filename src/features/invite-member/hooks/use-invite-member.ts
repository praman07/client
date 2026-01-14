import { useMutation } from '@tanstack/react-query'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAuth } from '@/shared/hooks'
import { useAppSelector } from '@/shared/lib/redux'
import { selectCurrentWorkspace } from '@/entities/session/model/selectors'
import { INVITE_TO_WORKSPACE } from '../api'

interface InviteMemberInput {
  emails: { email: string }[]
}

export function useInviteMember() {
  const { getToken } = useAuth()
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)

  return useMutation({
    mutationFn: async (values: InviteMemberInput) => {
      if (!currentWorkspace?.id) throw new Error('No workspace selected')
      const token = await getToken()
      const client = GqlClient(token)

      const emailList = values.emails.map((e) => e.email)

      return client.request(INVITE_TO_WORKSPACE, {
        input: {
          workspaceId: currentWorkspace.id,
          emails: emailList,
        },
      })
    },
  })
}
