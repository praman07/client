import { useLayoutEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { removeProjectScopedCache } from '@/shared/lib/cache'

/**
 * useProjectContextSwitch
 *
 * Detects a project change by comparing the incoming project ID against
 * the previously active one. On mismatch:
 *   - Removes project-scoped query cache for the previous project
 *
 * Workspace-level queries (project list, workspace members) are preserved.
 * Uses useLayoutEffect for synchronous cache removal before re-render.
 *
 * The ref starts as undefined so no removal fires on first mount — correct
 * behaviour since there is no previous project to clean up.
 *
 * Call inside ProjectLayout after the project ID is resolved from GQL.
 *
 * @param incomingProjectId - Resolved project.id (undefined while loading)
 * @layer Entity/Project
 */
export function useProjectContextSwitch(incomingProjectId: string | undefined): void {
  const queryClient = useQueryClient()
  const previousIdRef = useRef<string | undefined>(undefined)

  useLayoutEffect(() => {
    const previous = previousIdRef.current

    if (previous && previous !== incomingProjectId) {
      // Project changed within the same workspace — remove stale project cache
      removeProjectScopedCache(queryClient, previous)
    }

    previousIdRef.current = incomingProjectId
  }, [incomingProjectId, queryClient])
}
