import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleAddProjectMemberError } from '../lib/error-mapping'
import { ADD_PROJECT_MEMBER, projectMemberKeys  } from '@/entities/project-member'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

interface AddProjectMemberInput {
  projectId: string
  workspaceId: string
  userId: string
}

export function useAddProjectMember() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      workspaceId,
      userId,
    }: AddProjectMemberInput) => {
      const token = await getToken()
      return GqlClient(token).request(ADD_PROJECT_MEMBER, {
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
    onError: handleAddProjectMemberError,
  })
}
