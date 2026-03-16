import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import {
  Button,
  Skeleton,
  Avatar,
  AvatarFallback,
  AvatarImage,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui'
import { cn } from '@/shared/lib/utils'
import { useAppDispatch } from '@/shared/hooks'
import { useProjectMembers } from '@/entities/project-member'
import { PROJECT_MEMBER_FIELDS } from '@/entities/project-member'
import { useProjectRoles } from '@/entities/project-role'
import { PROJECT_ROLE_FIELDS } from '@/entities/project-role'
import { useRemoveProjectMember } from '@/features/project/remove-project-member/hooks/use-remove-project-member'
import { openAddMemberDialog } from '@/features/project/add-project-member/model/slice'
import { openLeaveProjectDialog } from '@/features/project/leave-project/model/slice'
import { RoleSelectorCell } from '@/features/project/update-project-member-role'
import { AddMemberDialog } from '@/features/project/add-project-member/ui/add-member-dialog'
import { LeaveProjectDialog } from '@/features/project/leave-project/ui/leave-project-dialog'
import { useFragment } from '@/gql'

interface ProjectMembersTableProps {
  projectId: string
  workspaceId: string
  workspaceSlug: string
  currentUserId?: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function RoleBadge({ role }: { role: string }) {
  const label = role.charAt(0) + role.slice(1).toLowerCase()
  const colorClass =
    role === 'MANAGER'
      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
      : role === 'CONTRIBUTOR'
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

function formatDate(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function ProjectMembersTable({
  projectId,
  workspaceId,
  workspaceSlug,
  currentUserId,
}: ProjectMembersTableProps) {
  const dispatch = useAppDispatch()
  const { data, isLoading } = useProjectMembers(projectId)
  const { data: rolesData } = useProjectRoles(projectId, workspaceId)
  const { mutate: removeMember, isPending: removing } = useRemoveProjectMember()
  const [removingUserId, setRemovingUserId] = useState<string | null>(null)

  const maskedMembers = data?.projectMembers ?? []
  const members = useFragment(PROJECT_MEMBER_FIELDS, maskedMembers)
  const existingMemberIds = members.map((m) => m.userId)

  // Unmask roles and build a simple list for the selector
  const maskedRoles = rolesData?.projectRoles ?? []
  const roles = useFragment(PROJECT_ROLE_FIELDS, maskedRoles)
  const assignableRoles = roles
    .filter((r) => !(r as any).isSystem) // exclude system roles (MANAGER)
    .map((r) => ({ id: r.id, name: r.name, rank: (r as any).rank ?? 99 }))
    .sort((a, b) => a.rank - b.rank)

  // Derive if the current user is a Manager from their own member row
  const currentUserMember = members.find((m) => m.userId === currentUserId)
  const isCurrentUserManager =
    currentUserMember?.role === 'MANAGER' || currentUserMember?.role === 'Manager'

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Members</h3>
          {!isLoading && (
            <p className="text-sm text-muted-foreground">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <Button size="sm" onClick={() => dispatch(openAddMemberDialog())}>
          <UserPlus className="mr-1.5 h-4 w-4" />
          Add Member
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden sm:table-cell">Joined</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Loading skeletons */}
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-44" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))}

            {/* Empty state */}
            {!isLoading && members.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No members yet. Add a workspace member above.
                </TableCell>
              </TableRow>
            )}

            {/* Rows */}
            {members.map((member) => {
              const isCurrentUser = member.userId === currentUserId
              return (
                <TableRow key={member.userId}>
                  {/* Identity */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={member.user?.avatarUrl ?? ''} />
                        <AvatarFallback className="text-xs">
                          {getInitials(member.user?.fullName ?? 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.user?.fullName ?? '—'}
                          {isCurrentUser && (
                            <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.user?.email ?? ''}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    {isCurrentUserManager &&
                    !isCurrentUser &&
                    member.role !== 'MANAGER' &&
                    member.role !== 'Manager' ? (
                      <RoleSelectorCell
                        userId={member.userId}
                        projectId={projectId}
                        workspaceId={workspaceId}
                        currentRoleName={member.role ?? null}
                        roles={assignableRoles}
                      />
                    ) : (
                      <RoleBadge role={member.role ?? 'VIEWER'} />
                    )}
                  </TableCell>

                  {/* Joined */}
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {member.joinedAt ? formatDate(member.joinedAt) : '—'}
                  </TableCell>

                  <TableCell className="text-right">
                    {isCurrentUser ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => dispatch(openLeaveProjectDialog())}
                      >
                        Leave
                      </Button>
                    ) : (
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
                          onOpenChange={(open) =>
                            !open && setRemovingUserId(null)
                          }
                        >
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove member?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                <strong>
                                  {member.user?.fullName ?? 'This member'}
                                </strong>{' '}
                                will lose access to all content in this project.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setRemovingUserId(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-white hover:bg-destructive/90"
                                onClick={() => {
                                  removeMember({
                                    projectId,
                                    workspaceId,
                                    userId: member.userId,
                                  })
                                  setRemovingUserId(null)
                                }}
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <AddMemberDialog
        projectId={projectId}
        workspaceId={workspaceId}
        existingMemberIds={existingMemberIds}
      />
      <LeaveProjectDialog projectId={projectId} workspaceSlug={workspaceSlug} />
    </div>
  )
}
