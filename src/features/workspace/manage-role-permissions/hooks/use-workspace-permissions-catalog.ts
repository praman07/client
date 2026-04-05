/**
 * useWorkspacePermissionsCatalog
 *
 * Fetches the workspace-scoped permission catalog (module = "workspace").
 * Returns the 17 permissions that govern workspace roles: core workspace ops,
 * member management, invite management, role management, and settings access.
 *
 * Use this hook — NOT usePermissionsCatalog — for the workspace roles settings page.
 * usePermissionsCatalog uses `allPermissions` which deliberately excludes workspace permissions.
 *
 * Permission key format: `${resource}:${action}`
 * Example: resource="workspace:member", action="invite" → key "workspace:member:invite"
 */
import { useQuery } from '@tanstack/react-query'
import { GET_WORKSPACE_PERMISSIONS_QUERY } from '../api/fragments'
import { rolePermissionKeys } from '../api/query-keys'
import { GqlClient } from '@/shared/api'
import { useAuth } from '@/shared/hooks'

export function useWorkspacePermissionsCatalog(workspaceId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: rolePermissionKeys.workspaceCatalog(workspaceId),
    queryFn: async () => {
      const token = await getToken()
      const client = GqlClient(token)
      const data = await client.request(GET_WORKSPACE_PERMISSIONS_QUERY, { workspaceId })
      return data.workspacePermissions
    },
    enabled: !!workspaceId,
    staleTime: 10 * 60 * 1000, // 10 min — catalog only changes on schema migrations
  })
}
