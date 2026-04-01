import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleToggleProjectPluginError } from '../lib/error-mapping'
import { TOGGLE_PROJECT_PLUGIN } from '../api/fragments'
import { projectKeys } from '@/entities/project'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

interface ToggleProjectPluginVariables {
  projectId: string
  workspaceId: string
  /** Used only for cache invalidation — not sent to the server. */
  workspaceSlug: string
  projectSlug: string
  type: string
  enable: boolean
}

/**
 * Mutation hook to enable or disable a plugin for a project.
 *
 * On success:
 *  - Invalidates the project-by-slug query so nav re-renders immediately.
 *
 * On error:
 *  - Delegates to handleToggleProjectPluginError for toast feedback.
 */
export function useToggleProjectPlugin() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      workspaceId,
      type,
      enable,
    }: ToggleProjectPluginVariables) => {
      const token = await getToken()
      return GqlClient(token).request(TOGGLE_PROJECT_PLUGIN, {
        projectId,
        workspaceId,
        type,
        enable,
      })
    },
    onSuccess: (_data, variables) => {
      // Invalidate project-by-slug so ProjectBaseLayout refetches
      // and the nav tabs reflect the updated plugin state immediately.
      queryClient.invalidateQueries({
        queryKey: projectKeys.bySlug(variables.workspaceId, variables.projectSlug),
      })
    },
    onError: handleToggleProjectPluginError,
  })
}
