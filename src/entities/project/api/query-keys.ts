export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...projectKeys.lists(), workspaceId] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  /** NOTE: includes workspaceId to prevent cross-workspace cache leakage */
  detail: (workspaceId: string, id: string) => [...projectKeys.details(), workspaceId, id] as const,
  /** Matches the key used by useProjectBySlug */
  bySlug: (workspaceId: string, slug: string) =>
    ['project', workspaceId, slug] as const,
  /**
   * Overview dashboard data for a project.
   * Invalidated on: issue/member/page mutations.
   */
  overview: (projectId: string) =>
    [...projectKeys.all, 'overview', projectId] as const,
  contributorStats: (projectId: string) =>
    [...projectKeys.all, 'contributor-stats', projectId] as const,
}
