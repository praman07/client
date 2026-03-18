export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...projectKeys.lists(), workspaceId] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  /**
   * Overview dashboard data for a project.
   * Invalidated on: issue/member/page mutations.
   */
  overview: (projectId: string) =>
    [...projectKeys.all, 'overview', projectId] as const,
}
