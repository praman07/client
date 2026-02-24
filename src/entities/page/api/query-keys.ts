/**
 * React Query key factory for the page entity
 *
 * Mirrors boardKeys from whiteboard-board. Consumed by:
 * - features/pages/fetch-page             → pageKeys.detail(pageId)
 * - features/pages/fetch-snapshot         → pageKeys.snapshot(pageId)
 * - features/pages/fetch-project-pages    → pageKeys.projectPages(projectId)
 * - features/pages/fetch-collaborators               → pageKeys.collaborators(pageId)
 * - features/pages/fetch-active-page-collaborators   → pageKeys.activeCollaborators(pageId)
 * - All mutation hooks                               → queryClient.invalidateQueries(pageKeys.*)
 *
 * @layer Entity
 */
export const pageKeys = {
  all: ['page'] as const,

  // List queries
  lists: () => [...pageKeys.all, 'list'] as const,
  projectPages: (projectId: string) =>
    [...pageKeys.lists(), 'project', projectId] as const,

  // Detail queries
  details: () => [...pageKeys.all, 'detail'] as const,
  detail: (pageId: string) => [...pageKeys.details(), pageId] as const,

  // Y.Doc snapshot — invalidated on page-update ACK from server
  snapshot: (pageId: string) => [...pageKeys.all, 'snapshot', pageId] as const,

  // DB collaborator list (authoritative, not real-time presence)
  collaborators: (pageId: string) =>
    [...pageKeys.detail(pageId), 'collaborators'] as const,

  // Redis ZSET presence snapshot (polled, NOT WS-driven — see page-presence entity for live state)
  activeCollaborators: (pageId: string) =>
    [...pageKeys.detail(pageId), 'active-collaborators'] as const,
}
