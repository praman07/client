/**
 * usePluginUpdateListener
 *
 * Listens for the `project.plugin.updated` CustomEvent that the auth-plugin
 * forwards when the server emits a plugin toggle on the user's event channel.
 * Invalidates the project-by-slug query so the nav re-renders immediately.
 *
 * Extracted from ProjectBaseLayout to satisfy SRP — this file owns only
 * the WS→query invalidation bridge, nothing else.
 *
 * @layer Routes (private — do not import from outside project.$projectSlug)
 */

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { projectKeys } from '@/entities/project'

export function usePluginUpdateListener(
  projectId: string | undefined,
  workspaceId: string | undefined,
  projectSlug: string,
) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!projectId) return

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId: string }>).detail
      if (detail?.projectId === projectId) {
        queryClient.invalidateQueries({
          queryKey: projectKeys.bySlug(workspaceId ?? '', projectSlug),
        })
      }
    }

    window.addEventListener('project.plugin.updated', handler)
    return () => window.removeEventListener('project.plugin.updated', handler)
  }, [projectId, workspaceId, projectSlug, queryClient])
}
