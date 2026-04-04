import { useMutation, useQueryClient } from '@tanstack/react-query'
import { INVITE_TO_WORKSPACE } from '../api'
import { GqlClient } from '@/shared/api/graphql-client'
import { useAppSelector, useAuth } from '@/shared/hooks'
import { selectCurrentWorkspace } from '@/entities/workspace'
import { workspaceInviteKeys } from '@/features/view-invites/api/query-keys'
import { toast } from 'sonner'

interface InviteMemberInput {
  emails: Array<{ email: string }>
  roleId: string
}

export function useInviteMember() {
  const queryClient = useQueryClient()
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
          roleId: values.roleId,
        },
      })
    },
    onSuccess: (res) => {
      if (res.inviteToWorkspace.success) {
        toast.success(res.inviteToWorkspace.message)
        if (currentWorkspace?.id) {
          queryClient.invalidateQueries({
            queryKey: workspaceInviteKeys.list(currentWorkspace.id),
          })
        }
      } else {
        toast.error(res.inviteToWorkspace.message)
      }
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to send invitations')
    },
  })
}
