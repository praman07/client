import type { QueryClient } from '@tanstack/react-query'

/**
 * Removes all workspace-scoped query cache entries.
 *
 * Called by useWorkspaceContextSwitch when the user navigates to a
 * different workspace. Uses removeQueries (not invalidateQueries) so
 * no stale Workspace A data is ever visible in Workspace B — content
 * areas will render their skeleton states while data loads fresh.
 *
 * Root keys are the first element of each domain's query key factory.
 * These are stable constants — update here if a new domain is added.
 *
 * @layer Shared/Lib
 */
export function removeWorkspaceScopedCache(queryClient: QueryClient): void {
  const projectScopedRoots = [
    'conversations',  // conversationKeys.all(wId, pId)
    'issues',         // issueKeys.all(projectId)
    'page',           // pageKeys.all
    'whiteboard-board', // boardKeys.all
    'vault-file',     // vaultFileKeys.all(projectId)
    'vault-folder',   // vaultFolderKeys.all(projectId)
    'project-members', // projectMemberKeys.all(projectId)
  ]

  const workspaceScopedRoots = [
    'projects',       // projectKeys.all — lists + details
    'project-roles',  // projectRoleKeys
    'role-permissions',
    'workspace-members',
    'allPermissions',
  ]

  for (const key of [...projectScopedRoots, ...workspaceScopedRoots]) {
    queryClient.removeQueries({ queryKey: [key] })
  }
}

/**
 * Removes project-scoped query cache entries for a specific project.
 *
 * Called by useProjectContextSwitch when the user navigates to a
 * different project within the same workspace. Workspace-level queries
 * (project list, workspace members) are preserved.
 *
 * @param previousProjectId - The project ID being navigated away from
 */
export function removeProjectScopedCache(
  queryClient: QueryClient,
  previousProjectId: string,
): void {
  // Domains that scope by projectId as part of their key
  queryClient.removeQueries({ queryKey: ['issues', previousProjectId] })
  queryClient.removeQueries({ queryKey: ['vault-file', previousProjectId] })
  queryClient.removeQueries({ queryKey: ['vault-folder', previousProjectId] })
  queryClient.removeQueries({ queryKey: ['project-members', previousProjectId] })

  // Pages and conversations scope by projectId inside their key hierarchy
  queryClient.removeQueries({ queryKey: ['page'] })
  queryClient.removeQueries({ queryKey: ['conversation'] })

  // Project detail + overview for the leaving project
  queryClient.removeQueries({ queryKey: ['projects', 'detail'] })
  queryClient.removeQueries({ queryKey: ['projects', 'overview', previousProjectId] })

  // Board is project-scoped — remove to force fresh load on project switch
  queryClient.removeQueries({ queryKey: ['whiteboard-board'] })
}
