/**
 * useProjectSync
 *
 * Keeps Redux `currentProject` in sync with the GQL-fetched project fragment.
 * Clears it automatically when the component unmounts (user leaves the project route).
 *
 * Extracted from ProjectBaseLayout to satisfy SRP — this file owns only
 * the Redux sync side-effect, nothing else.
 *
 * @layer Routes (private — do not import from outside project.$projectSlug)
 */

import { useEffect } from 'react'
import { useAppDispatch } from '@/shared/hooks'
import { setCurrentProject, clearCurrentProject } from '@/entities/project'
import type { Project } from '@/entities/project'

export function useProjectSync(project: Project | null) {
  const dispatch = useAppDispatch()

  // Sync: push project into Redux whenever the GQL fragment resolves/changes
  useEffect(() => {
    if (project) {
      dispatch(setCurrentProject(project))
    }
  }, [project, dispatch])

  // Cleanup: clear Redux state when user navigates away from the project tree
  useEffect(() => {
    return () => {
      dispatch(clearCurrentProject())
    }
  }, [dispatch])
}
