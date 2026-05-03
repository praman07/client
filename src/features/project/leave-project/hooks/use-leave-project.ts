import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { handleLeaveProjectError } from '../lib/error-mapping'
import { LEAVE_PROJECT, projectMemberKeys  } from '@/entities/project-member'
import { authContextKeys } from '@/shared/lib/auth/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useLeaveProject(projectId: string, workspaceSlug: string, workspaceId: string) {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(LEAVE_PROJECT, { projectId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectMemberKeys.list(projectId),
      })
      queryClient.invalidateQueries({
        queryKey: authContextKeys.scope(workspaceId, projectId),
      })
      navigate({ to: '/workspace/$workspaceSlug', params: { workspaceSlug } })
    },
    onError: handleLeaveProjectError,
  })
}
