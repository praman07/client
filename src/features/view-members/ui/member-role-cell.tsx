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
    return 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
  if (name === 'ADMIN')
    return 'bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25'
  if (name === 'GUEST')
    return 'bg-muted/50 text-muted-foreground/70 border-border/50 hover:bg-muted'
  return 'bg-muted/80 text-muted-foreground border-border hover:bg-muted'
}

function getRoleItemBadgeClass(roleName: string): string {
  const name = roleName.toUpperCase()
  if (name === 'OWNER') return 'bg-amber-500/15 text-amber-400'
  if (name === 'ADMIN') return 'bg-blue-500/15 text-blue-400'
  if (name === 'GUEST') return 'bg-muted/50 text-muted-foreground/70'
  return 'bg-muted text-muted-foreground'
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
      <DropdownMenuTrigger className="rounded-md outline-none focus-visible:ring-1 focus-visible:ring-ring/50">
        {badge}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44 p-1">
        <p className="px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
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
                <CheckIcon className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
