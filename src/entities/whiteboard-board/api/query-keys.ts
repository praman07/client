export const boardKeys = {
  all: ['whiteboard-board'] as const,
  lists: () => [...boardKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...boardKeys.lists(), workspaceId] as const,
  details: () => [...boardKeys.all, 'detail'] as const,
  detail: (boardId: string) => [...boardKeys.details(), boardId] as const,
  snapshot: (boardId: string) =>
    [...boardKeys.all, 'snapshot', boardId] as const,
}
