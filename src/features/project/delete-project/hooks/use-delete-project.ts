import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { handleDeleteProjectError } from '../lib/error-mapping'
import { DELETE_PROJECT, projectKeys, removeFromRecent  } from '@/entities/project'
import { GqlClient } from '@/shared/api'
import { useAppDispatch, useAuth } from '@/shared/hooks'

export function useDeleteProject(workspaceId: string, workspaceSlug: string) {
  const { getToken } = useAuth()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (projectId: string) => {
      const token = await getToken()
      return GqlClient(token).request(DELETE_PROJECT, { projectId })
    },
    onSuccess: (_, projectId) => {
      dispatch(removeFromRecent(projectId))
      queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) })
      navigate({ to: '/workspace/$workspaceSlug', params: { workspaceSlug } })
    },
    onError: handleDeleteProjectError,
  })
}
