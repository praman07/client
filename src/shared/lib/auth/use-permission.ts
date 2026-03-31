/**
 * use-permission.ts
 *
 * Returns true if the current user has the specified permission
 * at the current workspace/project scope.
 *
 * Usage:
 *   const canDelete = usePermission('workspace:delete')
 *   if (!canDelete) return null
 */
import { useAuthorizationContext } from './authorization-provider'
import type { AppPermission } from './app-permission'

export function usePermission(permission: AppPermission): boolean {
  const { grantedPermissions, isLoading } = useAuthorizationContext()
  if (isLoading) return false
  return grantedPermissions.includes(permission)
}
