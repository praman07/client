export const channelKeys = {
  all: ['channels'] as const,
  byWorkspace: (workspaceId: string) =>
    [...channelKeys.all, 'workspace', workspaceId] as const,
  byProject: (projectId: string) =>
    [...channelKeys.all, 'project', projectId] as const,
}
