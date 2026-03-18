/**
 * TanStack Query key factory for the project-member entity.
 *
 * Consumed by:
 *  - routes/project.$slug/settings/members → projectMemberKeys.list(projectId)
 *  - features/manage-project-members → invalidates list on mutation
 *
 * @layer Entity
 */
export const projectMemberKeys = {
  all: (projectId: string) => ['project-members', projectId] as const,
  /**
   * Full member list for a project.
   * Invalidated by: addProjectMember, removeProjectMember, updateProjectMemberRole, leaveProject
   */
  list: (projectId: string) =>
    [...projectMemberKeys.all(projectId), 'list'] as const,
}
