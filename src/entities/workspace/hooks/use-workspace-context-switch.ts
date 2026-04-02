import { useLayoutEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { selectCurrentWorkspaceId } from '../model'
import { useAppSelector } from '@/shared/hooks'
import { removeWorkspaceScopedCache } from '@/shared/lib/cache'

/**
 * useWorkspaceContextSwitch
 *
 * Detects a workspace change by comparing the incoming workspace ID against
 * the previously active one stored in Redux, then removes all workspace-scoped
 * query cache so no stale Workspace A data can appear in Workspace B.
 *
 * Uses useLayoutEffect so the cache is purged synchronously before child
 * routes render — content areas will show their skeleton states while
 * fresh data loads.
 *
 * NOTE: This hook does NOT dispatch setCurrentWorkspaceId.
 * That responsibility belongs to useSyncWorkspaceContext which resolves the
 * workspace from the server and then dispatches. This hook fires EARLIER,
 * using the slug change as the signal to purge.
 *
 * Call once at the top of the workspace route layout component.
 *
 * @param incomingSlug - The workspace slug from route params
 * @layer Entity/Workspace
 */
export function useWorkspaceContextSwitch(incomingSlug: string): void {
  const queryClient = useQueryClient()
  const currentWorkspaceId = useAppSelector(selectCurrentWorkspaceId)

  // Track the slug seen on the previous render to detect actual navigations
  const previousSlugRef = useRef<string | null>(null)

  useLayoutEffect(() => {
    const previous = previousSlugRef.current

    // If there was a previous slug AND it differs from the incoming one,
    // the user navigated to a different workspace — purge stale cache.
    // We also require that currentWorkspaceId is set so the first mount
    // (initial app load with no prior workspace) is a no-op.
    if (previous && previous !== incomingSlug && currentWorkspaceId) {
      removeWorkspaceScopedCache(queryClient)
    }

    previousSlugRef.current = incomingSlug
  }, [incomingSlug, currentWorkspaceId, queryClient])
}
