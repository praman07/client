import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { handleRemoveProjectMemberError } from '../lib/error-mapping'
import { REMOVE_PROJECT_MEMBER, projectMemberKeys } from '@/entities/project-member'
import { authContextKeys } from '@/shared/lib/auth/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

interface RemoveProjectMemberInput {
  projectId: string
  workspaceId: string
  userId: string
}

export function useRemoveProjectMember() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      workspaceId,
      userId,
    }: RemoveProjectMemberInput) => {
      const token = await getToken()
      return GqlClient(token).request(REMOVE_PROJECT_MEMBER, {
        projectId,
        workspaceId,
        userId,
      })
    },
    onSuccess: (_, { projectId, workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: projectMemberKeys.list(projectId),
      })
      queryClient.invalidateQueries({
        queryKey: authContextKeys.scope(workspaceId, projectId),
      })
      toast.success('Member removed')
    },
    onError: handleRemoveProjectMemberError,
  })
}

