import { useMutation, useQueryClient } from '@tanstack/react-query'
import { REMOVE_PROJECT_MEMBER } from '@/entities/project-member'
import { projectMemberKeys } from '@/entities/project-member'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { handleRemoveProjectMemberError } from '../lib/error-mapping'

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
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: projectMemberKeys.list(projectId),
      })
    },
    onError: handleRemoveProjectMemberError,
  })
}
