export const projectDmsKeys = {
  all: ['project-dms'] as const,
  list: (projectId: string) => [...projectDmsKeys.all, projectId] as const,
}
