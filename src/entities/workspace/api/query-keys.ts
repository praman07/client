export const workspaceKeys = {
  all: ['workspace'] as const,
  myWorkspaces: () => [...workspaceKeys.all, 'my-workspaces'] as const,
  detail: (slug: string) => [...workspaceKeys.all, 'detail', slug] as const,
  /**
   * Settings page cache — keyed by workspaceId (not slug).
   * Immutable key survives slug renames without requiring a refetch.
   */
  settings: (workspaceId: string) =>
    [...workspaceKeys.all, 'settings', workspaceId] as const,
  /**
   * Workspace roles list — replaces the orphaned workspaceRoleKeys in use-workspace-roles.ts.
   * Invalidated when: createWorkspaceRole, updateWorkspaceRole, deleteWorkspaceRole mutate.
   */
  roles: (workspaceId: string) =>
    [...workspaceKeys.all, 'roles', workspaceId] as const,
  checkSlug: (slug: string) =>
    [...workspaceKeys.all, 'check-slug', slug] as const,
  overview: (workspaceId: string) =>
    [...workspaceKeys.all, 'overview', workspaceId] as const,
}
