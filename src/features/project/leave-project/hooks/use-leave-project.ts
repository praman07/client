import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LEAVE_PROJECT } from '@/entities/project-member'
import { projectMemberKeys } from '@/entities/project-member'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'
import { handleLeaveProjectError } from '../lib/error-mapping'
import { useNavigate } from '@tanstack/react-router'

export function useLeaveProject(projectId: string, workspaceSlug: string) {
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
      navigate({ to: '/workspace/$workspaceSlug', params: { workspaceSlug } })
    },
    onError: handleLeaveProjectError,
  })
}
