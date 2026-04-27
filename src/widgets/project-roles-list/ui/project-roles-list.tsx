import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Lock,
  Pencil,
  Trash2,
  UserPlus,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Checkbox,
  ScrollArea,
  Skeleton,
} from '@/shared/ui'
import { useAppDispatch } from '@/shared/hooks'
import { Guard } from '@/shared/lib/auth'
import {
  PROJECT_ROLE_FIELDS,
  ROLE_PERMISSION_FIELDS,
  useAllPermissions,
  useProjectRoles,
  useRolePermissions
} from '@/entities/project-role'
import { useDeleteProjectRole } from '@/features/project/delete-project-role'
import {
  useAssignRolePermission,
  useRemoveRolePermission,
} from '@/features/project/manage-role-permissions'
import { CreateProjectRoleDialog, openCreateProjectRoleDialog } from '@/features/project/create-project-role'
import { UpdateProjectRoleDialog, openUpdateRoleDialog  } from '@/features/project/update-project-role'
import { useFragment } from '@/gql'

interface ProjectRolesListProps {
  projectId: string
  workspaceId: string
}

// ── Permission Panel ──────────────────────────────────────────────────────────

function RolePermissionsPanel({
  roleId,
  workspaceId,
}: {
  roleId: string
  workspaceId: string
}) {
  const { data: allPermsData, isLoading: loadingAll } =
    useAllPermissions(workspaceId)
  const { data: rolePermsData, isLoading: loadingRole } = useRolePermissions(
    roleId,
    workspaceId,
  )
  const { mutate: assign, isPending: assigning } = useAssignRolePermission()
  const { mutate: remove, isPending: removing } = useRemoveRolePermission()

  const maskedPerms = rolePermsData?.rolePermissions ?? []
  const rolePermissions = useFragment(ROLE_PERMISSION_FIELDS, maskedPerms)

  const isLoading = loadingAll || loadingRole
  const busy = assigning || removing

  // Build a Set of permissionIds that are currently ALLOW for this role
  const assignedIds = new Set(
    rolePermissions
      .filter((rp) => rp.effect === 'ALLOW')
      .map((rp) => rp.permissionId),
  )

  // Group all catalogue permissions by resource
  const allPermissions = allPermsData?.allPermissions ?? []
  const byResource = allPermissions.reduce<
    Record<string, typeof allPermissions>
  >((acc, p) => {
    acc[p.resource] = [...(acc[p.resource] ?? []), p]
    return acc
  }, {})

  function handleToggle(permissionId: string, isChecked: boolean) {
    if (isChecked) {
      assign({ roleId, workspaceId, permissionId, effect: 'ALLOW' })
    } else {
      remove({ roleId, workspaceId, permissionId })
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-3 bg-muted/20 space-y-2 border-t">
        <Skeleton className="h-4 w-24" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        <Skeleton className="h-4 w-20 mt-2" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      </div>
    )
  }

  if (allPermissions.length === 0) {
    return (
      <div className="px-4 py-3 bg-muted/20 border-t text-sm text-muted-foreground">
        No permissions available.
      </div>
    )
  }

  return (
    <div className="border-t bg-muted/10">
      <ScrollArea className="h-72">
        <div className="px-4 py-3 space-y-4">
          {Object.entries(byResource).map(([resource, perms]) => (
            <div key={resource}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                {resource.replace('.', ' › ')}
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {perms.map((p) => {
                  const checked = assignedIds.has(p.id)
                  return (
                    <label
                      key={p.id}
                      className={cn(
                        'flex items-center gap-2 text-sm cursor-pointer select-none',
                        busy && 'opacity-60 pointer-events-none',
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(val) =>
                          handleToggle(p.id, val === true)
                        }
                        disabled={busy}
                      />
                      <span className="text-sm">{p.action}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// ── Main Widget ───────────────────────────────────────────────────────────────

export function ProjectRolesList({
  projectId,
  workspaceId,
}: ProjectRolesListProps) {
  const dispatch = useAppDispatch()
  const { data, isLoading } = useProjectRoles(projectId, workspaceId)
  const { mutate: deleteRole, isPending: deleting } = useDeleteProjectRole()
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null)
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null)

  const maskedRoles = data?.projectRoles ?? []
  const roles = useFragment(PROJECT_ROLE_FIELDS, maskedRoles)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Roles</h3>
          {!isLoading && (
            <p className="text-sm text-muted-foreground">
              {roles.length} role{roles.length !== 1 ? 's' : ''} — manage access
              levels for project members.
            </p>
          )}
        </div>
        <Guard permission="project:role:create">
          <Button size="sm" onClick={() => dispatch(openCreateProjectRoleDialog())}>
            <UserPlus className="mr-1.5 h-4 w-4" />
            Create Role
          </Button>
        </Guard>
      </div>

      {/* List */}
      <div className="rounded-md border divide-y">
        {/* Loading skeletons */}
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          ))}

        {/* Empty state */}
        {!isLoading && roles.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No custom roles yet. System roles (Manager, Contributor, Viewer) are
            always available.
          </div>
        )}

        {/* Role rows */}
        {roles.map((role) => {
          const isExpanded = expandedRoleId === role.id
          return (
            <div key={role.id}>
              {/* Card header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{role.name}</span>
                    <Badge variant="default" className="text-xs">
                      Rank {role.rank}
                    </Badge>
                    {role.isSystem && (
                      <Badge
                        variant="outline"
                        className="gap-1 text-xs text-muted-foreground"
                      >
                        <Lock className="h-3 w-3" />
                        System
                      </Badge>
                    )}
                  </div>
                  {role.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">
                      {role.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Expand permissions */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      setExpandedRoleId(isExpanded ? null : role.id)
                    }
                    title={
                      isExpanded ? 'Collapse permissions' : 'Manage permissions'
                    }
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  {/* Edit (non-system only) */}
                  {!role.isSystem && (
                    <Guard permission="project:role:update">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => dispatch(openUpdateRoleDialog(role.id))}
                        title="Edit role"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Guard>
                  )}

                  {/* Delete (non-system only) */}
                  {!role.isSystem && (
                    <Guard permission="project:role:delete">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingRoleId(role.id)}
                        disabled={deleting}
                        title="Delete role"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog
                        open={deletingRoleId === role.id}
                        onOpenChange={(open) =>
                          !open && setDeletingRoleId(null)
                        }
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete role?</AlertDialogTitle>
                            <AlertDialogDescription>
                              The role <strong>{role.name}</strong> will be
                              permanently deleted. Members currently assigned
                              this role must be reassigned before deletion.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setDeletingRoleId(null)}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-white hover:bg-destructive/90"
                              onClick={() => {
                                deleteRole({
                                  roleId: role.id,
                                  projectId,
                                  workspaceId,
                                })
                                setDeletingRoleId(null)
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </Guard>
                  )}
                </div>
              </div>

              {/* Expandable permission panel */}
              {isExpanded && (
                <RolePermissionsPanel
                  roleId={role.id}
                  workspaceId={workspaceId}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Dialogs */}
      <CreateProjectRoleDialog
        projectId={projectId}
        workspaceId={workspaceId}
        existingRoleNames={roles.map((r) => r.name)}
      />
      <UpdateProjectRoleDialog
        projectId={projectId}
        workspaceId={workspaceId}
      />
    </div>
  )
}
