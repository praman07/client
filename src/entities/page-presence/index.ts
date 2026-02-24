// Redux actions (consumed by features/pages/events handlers)
export {
  setActivePageCollaborators,
  addPageCollaborator,
  removePageCollaborator,
  clearPageCollaborators,
  pagePresenceSlice,
} from './model/slice'

// Types
export type { PagePresenceState, PageCollaboratorPresence } from './model/types'

// Hook (consumed by widgets/page-editor/ui/CollaboratorBar.tsx)
export { useActivePageCollaborators } from './hooks/use-active-page-collaborators'
