export const workspaceKeys = {
  all: ['workspaces'] as const,
  my: () => [...workspaceKeys.all, 'my'] as const,
  details: () => [...workspaceKeys.all, 'detail'] as const,
  detail: (slug: string) => [...workspaceKeys.details(), slug] as const,
}
