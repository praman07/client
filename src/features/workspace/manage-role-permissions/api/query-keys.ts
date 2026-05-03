export const rolePermissionKeys = {
  all: ['workspace-role-permissions'] as const,
  byRole: (workspaceId: string, roleId: string) =>
    [...rolePermissionKeys.all, workspaceId, roleId] as const,
  catalog: (workspaceId: string) =>
    [...rolePermissionKeys.all, 'catalog', workspaceId] as const,
  /** Workspace-scoped permissions catalog (module='workspace'). Used by the roles settings page. */
  workspaceCatalog: (workspaceId: string) =>
    [...rolePermissionKeys.all, 'workspace-catalog', workspaceId] as const,
}
