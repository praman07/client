/**
 * TanStack Query key factories for the project-role entity.
 *
 * Consumed by:
 *  - routes/project.$slug/settings/roles → projectRoleKeys.list(projectId)
 *  - features/manage-project-roles → invalidates list on mutation
 *
 * @layer Entity
 */
export const projectRoleKeys = {
  all: (projectId: string) => ['project-roles', projectId] as const,
  /**
   * Role list for a project.
   * Invalidated by: createProjectRole, updateProjectRole, deleteProjectRole
   */
  list: (projectId: string) =>
    [...projectRoleKeys.all(projectId), 'list'] as const,
}

export const rolePermissionKeys = {
  all: (roleId: string) => ['role-permissions', roleId] as const,
  /**
   * Permission list for a specific role.
   * Invalidated by: assignRolePermission, removeRolePermission
   */
  list: (roleId: string) =>
    [...rolePermissionKeys.all(roleId), 'list'] as const,
  /**
   * Project-scoped permissions catalog (module='project'). Used by the roles settings page.
   * Invalidated on schema migrations only — staleTime set long (10 min).
   */
  projectCatalog: (workspaceId: string, projectId: string) =>
    ['project-role-permissions', 'project-catalog', workspaceId, projectId] as const,
}
