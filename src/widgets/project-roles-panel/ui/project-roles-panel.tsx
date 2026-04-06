import { useState, useMemo } from 'react'
import { useProjectRoles, useRolePermissions } from '@/entities/project-role/hooks'
import { useDeleteProjectRole } from '@/features/project/delete-project-role'
import { useProjectPermissionsCatalog } from '@/features/project/manage-role-permissions'
import { Loader2, ShieldOff } from 'lucide-react'
import { ProjectRoleList } from './project-role-list'
import { ProjectRolePermissionsPanel } from './project-role-permissions-panel'
import { ProjectRoleDeleteConfirm } from '.'

interface ProjectRolesPanelProps {
  workspaceId: string
  projectId: string
}

type RoleForPanel = {
  id: string
  name: string
  description: string | null
  isSystem: boolean
  rank: number
  permissions: { id: string; name: string }[]
}

export function ProjectRolesPanel({ workspaceId, projectId }: ProjectRolesPanelProps) {
  const { data: rolesData, isLoading: rolesLoading } = useProjectRoles(projectId, workspaceId)
  const roles: any[] = (rolesData?.projectRoles ?? []) as any[]

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null)

  const { mutateAsync: deleteRole, isPending: isDeleting } = useDeleteProjectRole()

  // Resolve the selected role (default to first)
  const selectedRole = useMemo(() => {
    if (!roles || roles.length === 0) return null
    if (selectedRoleId) return roles.find((r: any) => r.id === selectedRoleId) ?? roles[0]
    return roles[0]
  }, [roles, selectedRoleId])

  // Fetch permissions assigned to the selected role
  const { data: rolePermissionsData } = useRolePermissions(
    selectedRole?.id ?? '',
    workspaceId
  )

  // Fetch project-scoped permissions catalog (module='project')
  const { data: catalogData, isLoading: catalogLoading } = useProjectPermissionsCatalog(
    workspaceId,
    projectId
  )

  const isLoading = rolesLoading || catalogLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!roles || roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <ShieldOff className="h-12 w-12 mb-4 opacity-20" />
        <p>No roles found in this project.</p>
      </div>
    )
  }

  const handleDeleteRole = async () => {
    if (!roleToDelete) return
    try {
      await deleteRole({ roleId: roleToDelete, projectId, workspaceId })
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

  // Build roleForPanel with REAL fields from the query
  const rolePermissions = (rolePermissionsData as any)?.rolePermissions ?? []
  const roleForPanel: RoleForPanel | null = selectedRole
    ? {
        id: selectedRole.id,
        name: selectedRole.name,
        description: selectedRole.description ?? null,
        isSystem: selectedRole.isSystem,
        rank: selectedRole.rank,
        permissions: rolePermissions.map((rp: any) => ({
          id: rp.permissionId,
          name: rp.permission?.description ?? `${rp.permission?.resource}:${rp.permission?.action}`,
        })),
      }
    : null

  const roleToConfirmDelete = roles.find((r: any) => r.id === roleToDelete)

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* List Sidebar */}
      <div className="w-full lg:w-60 shrink-0">
        <ProjectRoleList
          roles={roles.map((r: any) => ({
            id: r.id,
            name: r.name,
            description: r.description ?? null,
            isSystem: r.isSystem,
            rank: r.rank,
            permissions: [],
          }))}
          selectedRoleId={roleForPanel?.id}
          onSelect={setSelectedRoleId}
        />
      </div>

      {/* Detail Editor */}
      <div className="flex-1 min-w-0">
        {roleForPanel ? (
          <ProjectRolePermissionsPanel
            key={roleForPanel.id} // VITAL: resets all local state on role switch
            workspaceId={workspaceId}
            projectId={projectId}
            role={roleForPanel}
            availablePermissions={availablePermissions}
            onDelete={setRoleToDelete}
          />
        ) : (
          <div className="flex h-full items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground min-h-[400px]">
            Select a role to view permissions
          </div>
        )}

      </div>

      {roleToConfirmDelete && (
        <ProjectRoleDeleteConfirm
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
