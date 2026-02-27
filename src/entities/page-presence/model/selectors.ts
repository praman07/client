import type { RootState } from '@/app/store/config'

/**
 * Selectors for the pagePresence Redux slice.
 * Used by widgets/page-editor/ui/CollaboratorBar.
 *
 * @layer Entity
 */
export const selectPageCollaborators = (state: RootState) =>
  Object.values(state.pagePresence.collaborators)

export const selectPageCollaboratorRecord = (state: RootState) =>
  state.pagePresence.collaborators

export const selectPageCollaboratorCount = (state: RootState) =>
  state.pagePresence.totalCount

export const selectPageCollaboratorById =
  (userId: string) => (state: RootState) =>
    state.pagePresence.collaborators[userId]
