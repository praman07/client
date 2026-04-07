import { useState } from 'react'
import { Search, ShieldOff, UserPlus } from 'lucide-react'
import type { ColumnDef } from '@/shared/ui'
import type { ProjectMemberFieldsFragment, ProjectRoleFieldsFragment } from '@/gql/graphql'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DataTable,
  DataTableSkeleton,
  Input,
} from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { formatDate } from '@/shared/lib/date'
import { useAppDispatch, useAuth  } from '@/shared/hooks'
import { useAuthorizationContext, usePermission } from '@/shared/lib/auth'
import { useProjectMembers } from '@/entities/project-member'
import { useProjectRoles } from '@/entities/project-role'
import { useRemoveProjectMember } from '@/features/project/remove-project-member'
import {
  AddMemberDialog,
  openAddMemberDialog,
} from '@/features/project/add-project-member'
import {
  LeaveProjectDialog,
  openLeaveProjectDialog,
} from '@/features/project/leave-project'
import { RoleSelectorCell } from '@/features/project/update-project-member-role'

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProjectMembersTableProps {
  projectId: string
  workspaceId: string
  workspaceSlug: string
}

interface AssignableRole {
  id: string
  name: string
  rank: number
  isSystem: boolean
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface RoleBadgeProps {
  role: string
  /**
   * undefined = system role (MANAGER-equivalent) → indigo
   * rank <= 1  = lowest assignable rank → green
   * otherwise  = neutral secondary
   */
  rank?: number
}

function RoleBadge({ role, rank }: RoleBadgeProps) {
  const label = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  const colorClass =
    rank === undefined
      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
      : rank <= 1
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
        : 'bg-secondary text-secondary-foreground'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        colorClass,
      )}
    >
      {label}
    </span>
  )
}

// ── Row type used by DataTable ─────────────────────────────────────────────────

interface ProjectMemberRow {
  id: string
  userId: string
  roleId: string | null | undefined
  role: string | null | undefined
  joinedAt: string
  user: {
    id: string
    fullName?: string | null
    email: string
    avatarUrl?: string | null
  }
}

// ── Widget ─────────────────────────────────────────────────────────────────────

export function ProjectMembersTable({
  projectId,
  workspaceId,
  workspaceSlug,
}: ProjectMembersTableProps) {
  const dispatch = useAppDispatch()
  const { userId: currentUserId } = useAuth()
  const { isLoading: authLoading } = useAuthorizationContext()

  // Permission gates
  const canAddMember = usePermission('project:member:add')
  const canRemoveMember = usePermission('project:member:remove')
  const canUpdateRole = usePermission('project:member:role-update')

  // Data
  const { data, isLoading } = useProjectMembers(projectId)
  const { data: rolesData } = useProjectRoles(projectId, workspaceId)
  const { mutate: removeMember, isPending: removing } = useRemoveProjectMember()

  // Cast directly — graphql-request returns plain objects, no Apollo cache masking needed
  const members = (data?.projectMembers ?? []) as Array<ProjectMemberFieldsFragment>
  const roles = (rolesData?.projectRoles ?? []) as Array<ProjectRoleFieldsFragment>

  // Build all project roles for the selectors, sorted: system roles first (highest rank), then custom by rank.
  // System roles (MANAGER) are valid assignment targets — do NOT filter them out.
  const assignableRoles: Array<AssignableRole> = roles
    .map((r) => ({
      id: r.id,
      name: r.name,
      rank: (r as unknown as { rank: number }).rank,
      isSystem: (r as unknown as { isSystem: boolean }).isSystem,
    }))
    .sort((a, b) => b.rank - a.rank) // system roles (high rank) first, custom after

  // Derive existingMemberIds for the add-member dialog filter
  const existingMemberIds = members.map((m) => m.userId)

  // Search state
  const [search, setSearch] = useState('')

  // Confirm-remove state
  const [removingUserId, setRemovingUserId] = useState<string | null>(null)

  // ── Auth loading guard ───────────────────────────────────────────────────────
  // Prevents permission-gated UI from flashing "forbidden" before auth resolves
  if (authLoading) return null

  // ── Row data ─────────────────────────────────────────────────────────────────
  const rows: Array<ProjectMemberRow> = members
    .filter((m) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        (m.user.fullName ?? '').toLowerCase().includes(q) ||
        m.user.email.toLowerCase().includes(q)
      )
    })
    .map((m) => ({
      id: m.id,
      userId: m.userId,
      roleId: m.roleId,
      role: m.role,
      joinedAt: m.joinedAt,
      user: m.user,
    }))

  // ── Column definitions ───────────────────────────────────────────────────────
  const columns: Array<ColumnDef<ProjectMemberRow>> = [
    {
      key: 'user',
      header: 'Member',
      headerClassName: 'w-[260px]',
      render: (member) => {
        const isCurrentUser = member.userId === currentUserId
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0 border border-border/40">
              <AvatarImage src={member.user.avatarUrl ?? undefined} />
              <AvatarFallback className="text-[11px] font-bold bg-muted text-muted-foreground">
                {getInitials(member.user.fullName ?? member.user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground tracking-tight">
                {member.user.fullName ?? 'Unknown User'}
                {isCurrentUser && (
                  <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                    (you)
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {member.user.email}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'role',
      header: 'Role',
      render: (member) => {
        const isCurrentUser = member.userId === currentUserId
        // Gate: permission + not self. assignableRoles now includes system roles.
        const canEditThisRow = canUpdateRole && !isCurrentUser

        // Look up member's role for badge colouring (all roles including system)
        const memberRoleInfo = assignableRoles.find((r) => r.id === member.roleId)

        return canEditThisRow ? (
          <RoleSelectorCell
            userId={member.userId}
            projectId={projectId}
            workspaceId={workspaceId}
            currentRoleId={member.roleId ?? null}
            currentRoleName={member.role ?? null}
            roles={assignableRoles}
          />
        ) : member.role ? (
          <RoleBadge role={member.role} rank={memberRoleInfo?.rank} />
        ) : (
          <span className="text-xs text-muted-foreground">No role</span>
        )
      },
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      cellClassName: 'text-muted-foreground text-xs',
      render: (member) => formatDate(member.joinedAt),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right pr-4',
      cellClassName: 'text-right pr-4',
      render: (member) => {
        const isCurrentUser = member.userId === currentUserId
        if (isCurrentUser) {
          return (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => dispatch(openLeaveProjectDialog())}
            >
              Leave
            </Button>
          )
        }

        if (!canRemoveMember) return null

        return (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setRemovingUserId(member.userId)}
              disabled={removing}
            >
              Remove
            </Button>

            <AlertDialog
              open={removingUserId === member.userId}
              onOpenChange={(open) => !open && setRemovingUserId(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove member?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>{member.user.fullName}</strong>{' '}
                    will lose access to all content in this project.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setRemovingUserId(null)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-white hover:bg-destructive/90"
                    onClick={() => {
                      removeMember({ projectId, workspaceId, userId: member.userId })
                      setRemovingUserId(null)
                    }}
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )
      },
    },
  ]

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Project Members</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage who has access to this project.
          </p>
        </div>
        {canAddMember && (
          <div className="w-full sm:w-auto">
            <Button onClick={() => dispatch(openAddMemberDialog())}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center px-1">
        <div className="relative flex-1 max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none" />
          <Input
            placeholder="Filter by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm bg-muted/20 border-border/40 focus-visible:ring-primary/20 hover:bg-muted/30 transition-all rounded-lg"
          />
        </div>
      </div>

      {/* Table */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <DataTableSkeleton columnCount={4} rowCount={4} />
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(m) => m.id}
            search={search}
            emptyMessage="No members yet. Add a workspace member above."
            emptySearchMessage={`No members match "${search}"`}
          />
        )}
      </div>

      {/* Footer count */}
      {!isLoading && members.length > 0 && (
        <p className="text-[11px] text-muted-foreground/60 uppercase tracking-widest font-semibold flex items-center gap-2 px-1">
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          {members.length} {members.length === 1 ? 'member' : 'members'}
          {search && (
            <>
              {' '}— filtered by "{search}"
            </>
          )}
        </p>
      )}

      {/* Permission denial — no read access */}
      {!canAddMember && !canRemoveMember && !canUpdateRole && members.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="p-3 rounded-full bg-destructive/10">
            <ShieldOff className="h-7 w-7 text-destructive" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Access Restricted</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              You don't have permission to manage project members.
            </p>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <AddMemberDialog
        projectId={projectId}
        workspaceId={workspaceId}
        existingMemberIds={existingMemberIds}
        assignableRoles={assignableRoles}
      />
      <LeaveProjectDialog
        projectId={projectId}
        workspaceSlug={workspaceSlug}
        workspaceId={workspaceId}
      />
    </div>
  )
}
