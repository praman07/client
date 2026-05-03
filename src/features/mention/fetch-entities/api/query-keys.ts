export const projectEntityKeys = {
  all: ['project-entities'] as const,
  list: (projectId: string) =>
    [...projectEntityKeys.all, 'list', projectId] as const,
}
