export const channelKeys = {
  all: ['channels'] as const,
  lists: () => [...channelKeys.all, 'list'] as const,
  list: (projectId: string) => [...channelKeys.lists(), projectId] as const,
  details: () => [...channelKeys.all, 'detail'] as const,
  detail: (id: string) => [...channelKeys.details(), id] as const,
}
