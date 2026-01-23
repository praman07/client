export const channelKeys = {
  all: ['channels'] as const,
  lists: () => [...channelKeys.all, 'list'] as const,
  list: (workspaceId: string, projectId: string) => [...channelKeys.lists(), workspaceId, projectId] as const,
  details: () => [...channelKeys.all, 'detail'] as const,
  detail: (id: string) => [...channelKeys.details(), id] as const,
}
