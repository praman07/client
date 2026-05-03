/**
 * useProjectPermissionsCatalog
 *
 * Fetches the project-scoped permission catalog (module = "project").
 * Returns the permissions that govern project role management:
 * project core ops, member management, role management, and settings access.
 *
 * Use this hook — NOT useAllPermissions — for the project roles settings page.
 * useAllPermissions covers all non-workspace modules and is too broad for
 * the project roles matrix.
 *
 * Permission key format: `${resource}:${action}`
 * Example: resource="project:member", action="add" → key "project:member:add"
 */
import { useQuery } from '@tanstack/react-query'
import { GET_PROJECT_PERMISSIONS } from '@/entities/project-role/api'
import { rolePermissionKeys } from '@/entities/project-role/api/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useProjectPermissionsCatalog(workspaceId: string, projectId: string) {
  const { getToken, isSignedIn } = useAuth()

  return useQuery({
    queryKey: rolePermissionKeys.projectCatalog(workspaceId, projectId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(GET_PROJECT_PERMISSIONS, { workspaceId, projectId })
      return data.projectPermissions
    },
    enabled: !!isSignedIn && !!workspaceId && !!projectId,
    staleTime: 10 * 60 * 1000, // 10 min — catalog only changes on schema migrations
  })
}
