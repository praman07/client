import { useQuery } from '@tanstack/react-query'
import { GET_PROJECT_ROLES, GET_ROLE_PERMISSIONS } from '../api'
import { projectRoleKeys, rolePermissionKeys } from '../api/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

/**
 * Fetches all project-scoped roles for a project.
 * Consumed by: routes/project.$slug/settings/roles
 *
 * @layer Entity — read-only query hook
 */
export function useProjectRoles(projectId: string, workspaceId: string) {
  const { getToken, isSignedIn } = useAuth()

  return useQuery({
    queryKey: projectRoleKeys.list(projectId),
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(GET_PROJECT_ROLES, {
        projectId,
        workspaceId,
      })
    },
    enabled: !!projectId && !!workspaceId && !!isSignedIn,
    staleTime: 60_000,
  })
}

/**
 * Fetches all permissions assigned to a specific role.
 * Consumed by: roles/permissions panel in settings/roles
 *
 * @layer Entity — read-only query hook
 */
export function useRolePermissions(roleId: string, workspaceId: string) {
  const { getToken, isSignedIn } = useAuth()

  return useQuery({
    queryKey: rolePermissionKeys.list(roleId),
    queryFn: async () => {
      const token = await getToken()
      return GqlClient(token).request(GET_ROLE_PERMISSIONS, {
        roleId,
        workspaceId,
      })
    },
    enabled: !!roleId && !!workspaceId && !!isSignedIn,
    staleTime: 60_000,
  })
}
