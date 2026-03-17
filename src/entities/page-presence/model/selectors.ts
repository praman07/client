import type { RootState } from '@/app/store/config'
import type { PageCollaboratorPresence } from './types'

/**
 * Selectors for the pagePresence Redux slice.
 * Used by widgets/page-editor/ui/CollaboratorBar.
 *
 * @layer Entity
 */
export const selectPageCollaborators = (state: RootState): Array<PageCollaboratorPresence> =>
  Object.values(state.pagePresence.collaborators).filter(
    (c): c is PageCollaboratorPresence => c !== undefined,
  )

export const selectPageCollaboratorRecord = (state: RootState) =>
  state.pagePresence.collaborators

export const selectPageCollaboratorCount = (state: RootState) =>
  state.pagePresence.totalCount

export const selectPageCollaboratorById =
  (userId: string) => (state: RootState) =>
    state.pagePresence.collaborators[userId]
