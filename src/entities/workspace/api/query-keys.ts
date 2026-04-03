export const workspaceKeys = {
  all: ['workspace'] as const,
  myWorkspaces: () => [...workspaceKeys.all, 'my-workspaces'] as const,
  detail: (slug: string) => [...workspaceKeys.all, 'detail', slug] as const,
  checkSlug: (slug: string) =>
    [...workspaceKeys.all, 'check-slug', slug] as const,
  overview: (workspaceId: string) =>
    [...workspaceKeys.all, 'overview', workspaceId] as const,
}
