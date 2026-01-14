export const navigationKeys = {
  all: ['navigation'] as const,
  myWorkspaces: () => [...navigationKeys.all, 'my-workspaces'] as const,
}
