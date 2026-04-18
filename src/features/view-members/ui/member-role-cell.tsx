import { CheckIcon, ChevronDown, Loader2 } from 'lucide-react'
import { useUpdateMemberRole } from '../hooks'
import type { WorkspaceMember } from '../model/types'
import { cn } from '@/shared/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui'
import { usePermission } from '@/shared/lib/auth'
import { useWorkspaceRoles } from '@/entities/workspace/hooks'

interface MemberRoleCellProps {
  member: WorkspaceMember
  workspaceId: string
  actorRank: number
  actorUserId: string
}

/** Color tokens per role name — matches DESIGN.md surface philosophy */
function getRoleBadgeClass(roleName: string): string {
  const name = roleName.toUpperCase()
  if (name === 'OWNER')
    return 'bg-warning-subtle text-warning-primary border-warning-subtle hover:bg-warning-subtle'
  if (name === 'ADMIN')
    return 'bg-accent-subtle text-accent-primary border-accent-subtle hover:bg-accent-subtle'
  if (name === 'GUEST')
    return 'bg-layer-2 text-tertiary border-subtle hover:bg-layer-2-hover'
  return 'bg-layer-2 text-secondary border-subtle hover:bg-layer-2-hover'
}

function getRoleItemBadgeClass(roleName: string): string {
  const name = roleName.toUpperCase()
  if (name === 'OWNER') return 'bg-warning-subtle text-warning-primary'
  if (name === 'ADMIN') return 'bg-accent-subtle text-accent-primary'
  if (name === 'GUEST') return 'bg-layer-2 text-tertiary'
  return 'bg-layer-2 text-secondary'
}

export function MemberRoleCell({
  member,
  workspaceId,
  actorRank,
  actorUserId,
}: MemberRoleCellProps) {
  const canUpdateRoles = usePermission('workspace:member:role-update')
  const { data: roles = [] } = useWorkspaceRoles()
  const { mutate: updateRole, isPending } = useUpdateMemberRole(workspaceId)

  // Actor must strictly outrank the target to edit their role
  const isSelf = member.user.id === actorUserId
  const canEditThisMember =
    canUpdateRoles && !isSelf && actorRank > member.roleRank

  const badge = (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
        getRoleBadgeClass(member.role),
        canEditThisMember && 'cursor-pointer',
      )}
    >
      {isPending ? (
        <Loader2 className="h-2.5 w-2.5 animate-spin" />
      ) : null}
      {member.role}
      {canEditThisMember && (
        <ChevronDown className="h-2.5 w-2.5 opacity-60" />
      )}
    </span>
  )

  if (!canEditThisMember) return badge

  // Only show roles the actor can assign (rank must be < actorRank)
  const assignableRoles = roles.filter((r) => r.rank < actorRank)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-md outline-none">
        {badge}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44 p-1">
        <p className="px-2 py-1 text-10 uppercase tracking-widest text-tertiary font-medium">
          Assign role
        </p>
        <DropdownMenuSeparator />
        {assignableRoles.map((role) => {
          const isSelected = role.id === member.roleId
          return (
            <DropdownMenuItem
              key={role.id}
              className="flex items-center justify-between gap-2"
              onClick={() => {
                if (!isSelected) updateRole({ memberId: member.id, roleId: role.id })
              }}
              disabled={isPending}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                    getRoleItemBadgeClass(role.name),
                  )}
                >
                  {role.name}
                </span>
              </span>
              {isSelected && (
                <CheckIcon className="h-3.5 w-3.5 text-tertiary" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
