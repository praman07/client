export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (conversationId: string) =>
    [...messageKeys.lists(), conversationId] as const,
  thread: (parentMessageId: string) =>
    [...messageKeys.all, 'thread', parentMessageId] as const,
  details: () => [...messageKeys.all, 'detail'] as const,
  detail: (id: string) => [...messageKeys.details(), id] as const,
}
