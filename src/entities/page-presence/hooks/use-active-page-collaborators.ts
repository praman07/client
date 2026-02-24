import { useAppSelector } from '@/shared/hooks'

/**
 * Access the list of active collaborators on the current page.
 *
 * Consumed by:
 * - widgets/page-editor/ui/CollaboratorBar.tsx — avatar row
 *
 * Returns the collaborator array derived from Redux state (not
 * a GraphQL query — presence is ephemeral and WS-driven).
 *
 * @layer Entity
 */
export function useActivePageCollaborators() {
  const collaborators = useAppSelector((state) =>
    Object.values(state.pagePresence.collaborators),
  )
  const count = useAppSelector((state) => state.pagePresence.totalCount)

  return {
    collaborators,
    count,
    hasCollaborators: count > 0,
  }
}
