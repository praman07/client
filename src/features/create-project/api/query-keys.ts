export const createProjectKeys = {
  all: ['create-project'] as const,
  checkSlug: (workspaceId: string, slug: string) =>
    [...createProjectKeys.all, 'check-slug', { workspaceId, slug }] as const,
}
