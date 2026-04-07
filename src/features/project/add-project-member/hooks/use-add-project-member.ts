import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { handleAddProjectMemberError } from '../lib/error-mapping'
import { ADD_PROJECT_MEMBER, projectMemberKeys } from '@/entities/project-member'
import { authContextKeys } from '@/shared/lib/auth/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

interface AddProjectMemberInput {
  projectId: string
  workspaceId: string
  userId: string
  roleId: string
}

export function useAddProjectMember() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      workspaceId,
      userId,
      roleId,
    }: AddProjectMemberInput) => {
      const token = await getToken()
      return GqlClient(token).request(ADD_PROJECT_MEMBER, {
        projectId,
        workspaceId,
        userId,
        roleId,
      })
    },
    onSuccess: (_, { projectId, workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: projectMemberKeys.list(projectId),
      })
      queryClient.invalidateQueries({
        queryKey: authContextKeys.scope(workspaceId, projectId),
      })
      toast.success('Member added')
    },
    onError: handleAddProjectMemberError,
  })
}
