import { useMemo, useState } from 'react'
import { Loader2, ShieldOff } from 'lucide-react'
import { WorkspaceRoleList } from './workspace-role-list'
import { WorkspaceRolePermissionsPanel } from './workspace-role-permissions-panel'
import { RoleDeleteConfirm } from './role-delete-confirm'
import {
  useRolePermissions,
  useWorkspacePermissionsCatalog,
} from '@/features/workspace/manage-role-permissions'
import { useDeleteWorkspaceRole } from '@/features/workspace/manage-workspace-role'
import { useCurrentWorkspace, useWorkspaceRoles } from '@/entities/workspace/hooks'

/** Shape expected by the permissions panel */
type RoleForPanel = {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  rank: number
  permissions: Array<{ id: string; name: string }>
}

export function WorkspaceRolesPanel() {
  const currentWorkspace = useCurrentWorkspace()
  const { data: roles, isLoading: rolesLoading } = useWorkspaceRoles()
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null)

  const { mutateAsync: deleteRole, isPending: isDeleting } = useDeleteWorkspaceRole(
    currentWorkspace?.id ?? ''
  )

  // Resolve the selected role (default to first)
  const selectedRole = useMemo(() => {
    if (!roles || roles.length === 0) return null
    if (selectedRoleId) return roles.find((r: any) => r.id === selectedRoleId) ?? roles[0]
    return roles[0]
  }, [roles, selectedRoleId])

  // Fetch permissions assigned to the selected role
  const { data: rolePermissionsData } = useRolePermissions(
    currentWorkspace?.id ?? '',
    selectedRole?.id ?? ''
  )

  // Fetch workspace-scoped permissions catalog (module='workspace')
  // IMPORTANT: uses useWorkspacePermissionsCatalog (not usePermissionsCatalog which
  // excludes workspace-module permissions — the opposite of what we need here)
  const { data: catalogData, isLoading: catalogLoading } = useWorkspacePermissionsCatalog(
    currentWorkspace?.id ?? ''
  )

  const isLoading = rolesLoading || catalogLoading

  if (isLoading || !currentWorkspace) {
    return (
<div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-secondary" />
    </div>
    )
  }

  if (!roles || roles.length === 0) {
    return (
<div className="flex flex-col items-center justify-center h-64 text-secondary">
      <ShieldOff className="h-12 w-12 mb-4 opacity-20" />
      <p>No roles found in this workspace.</p>
    </div>
    )
  }

  const handleDeleteRole = async () => {
    if (!roleToDelete) return
    try {
      await deleteRole(roleToDelete)
      setRoleToDelete(null)
      if (selectedRoleId === roleToDelete) {
        setSelectedRoleId(null)
      }
    } catch {
      // Toast handled by hook
    }
  }

  // Map catalog to permission panel shape
  const availablePermissions = (catalogData ?? []).map((p: any) => ({
    id: p.id,
    name: p.description ?? `${p.resource}:${p.action}`,
    resource: p.resource,
    action: p.action,
    module: p.module,
  }))

  // Build roleForPanel with REAL fields from the query (not hardcoded)
  const roleForPanel: RoleForPanel | null = selectedRole
    ? {
        id: selectedRole.id,
        name: selectedRole.name,
        description: selectedRole.description ?? null,   // real field from GET_WORKSPACE_ROLES_QUERY
        isSystem: selectedRole.isSystem,                 // real field — determines editability
        rank: selectedRole.rank,
        permissions: (rolePermissionsData ?? []).map((rp: any) => ({
          id: rp.permissionId,
          name: rp.permission?.description ?? `${rp.permission?.resource}:${rp.permission?.action}`,
        })),
      }
    : null

  const roleToConfirmDelete = roles.find((r: any) => r.id === roleToDelete)

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full min-h-0">
      {/* List Sidebar */}
      <div className="w-full lg:w-56 xl:w-60 shrink-0">
        <WorkspaceRoleList
          roles={roles.map((r: any) => ({
            id: r.id,
            name: r.name,
            description: r.description ?? null,  // real field
            isSystem: r.isSystem,                 // real field
            rank: r.rank,
            permissions: [],
          }))}
          selectedRoleId={roleForPanel?.id}
          onSelect={setSelectedRoleId}
        />
      </div>

      {/* Detail Editor */}
      <div className="flex-1 min-w-0 w-full">
        {roleForPanel ? (
          <WorkspaceRolePermissionsPanel
            key={roleForPanel.id} // VITAL: resets all local state on role switch
            workspaceId={currentWorkspace.id}
            role={roleForPanel}
            availablePermissions={availablePermissions}
            onDelete={setRoleToDelete}
          />
        ) : (
          <div className="flex h-full items-center justify-center border-2 border-dashed border-subtle rounded-lg text-secondary min-h-[400px]">
            Select a role to view permissions
          </div>
        )}
      </div>

      {roleToConfirmDelete && (
        <RoleDeleteConfirm
          isOpen={!!roleToDelete}
          isDeleting={isDeleting}
          roleName={roleToConfirmDelete.name}
          onClose={() => setRoleToDelete(null)}
          onConfirm={handleDeleteRole}
        />
      )}
    </div>
  )
}
