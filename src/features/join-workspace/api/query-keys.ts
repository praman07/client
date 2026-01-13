export const joinWorkspaceKeys = {
  info: (token: string) => ['workspace-invite', token] as const,
}
