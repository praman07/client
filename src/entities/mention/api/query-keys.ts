export const mentionKeys = {
  all: () => ['mentions'] as const,

  list: (sourceEntityId: string) =>
    [...mentionKeys.all(), 'list', sourceEntityId] as const,

  backlinks: (targetEntityId: string) =>
    [...mentionKeys.all(), 'backlinks', targetEntityId] as const,

  events: (mentionId: string) =>
    [...mentionKeys.all(), 'events', mentionId] as const,
}
