export const workspaceInviteKeys = {
  all: ['workspace-invites'] as const,
  list: (workspaceId: string) =>
    [...workspaceInviteKeys.all, 'list', workspaceId] as const,
}
