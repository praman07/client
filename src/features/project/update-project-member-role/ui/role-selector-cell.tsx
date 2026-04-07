import { useState } from 'react'
import { Check, ChevronDown, Loader2 } from 'lucide-react'
import { useUpdateProjectMemberRole } from '../hooks/use-update-project-member-role'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

interface Role {
  id: string
  name: string
  rank: number
  isSystem?: boolean
}

interface RoleSelectorCellProps {
  userId: string
  projectId: string
  workspaceId: string
  /** Member's current role ID (from ProjectMemberFields.roleId) — stable, ID-based */
  currentRoleId: string | null
  /** Member's current role name string (from ProjectMemberFields.role) — display fallback */
  currentRoleName: string | null
  /** Assignable project roles (system roles excluded, sorted by rank) */
  roles: Array<Role>
}

/**
 * Renders the member's current role as a styled badge.
 * Clicking it opens a DropdownMenu of available project roles.
 * Only shown when canUpdateRole && !isCurrentUser (controlled by parent widget).
 *
 * @layer Feature — update-project-member-role
 */
export function RoleSelectorCell({
  userId,
  projectId,
  workspaceId,
  currentRoleId,
  currentRoleName,
  roles,
}: RoleSelectorCellProps) {
  const { mutate: updateRole, isPending } = useUpdateProjectMemberRole()

  // Resolve the initial selected role by ID first (accurate), fallback to name match
  const resolveInitialRole = () => {
    if (currentRoleId) {
      const byId = roles.find((r) => r.id === currentRoleId)
      if (byId) return byId
    }
    if (currentRoleName) {
      return roles.find(
        (r) => r.name.toLowerCase() === currentRoleName.toLowerCase(),
      )
    }
    return undefined
  }

  const initialRole = resolveInitialRole()
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(
    initialRole?.id ?? currentRoleId,
  )

  function handleSelect(role: Role) {
    const prev = selectedRoleId
    setSelectedRoleId(role.id)
    updateRole(
      { projectId, workspaceId, userId, roleId: role.id },
      { onError: () => setSelectedRoleId(prev) },
    )
  }

  // Derive display name from selected ID → role object → fallback to raw name string
  const selectedRole = roles.find((r) => r.id === selectedRoleId)
  const displayName = selectedRole?.name ?? currentRoleName ?? 'No role'

  // Badge colour: system roles → indigo, low-rank custom → green, others → secondary
  const isSystemRole = selectedRole?.isSystem ?? false
  const isLowerRank = !isSystemRole && selectedRole ? selectedRole.rank <= 1 : false
  const badgeClass = cn(
    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
    isSystemRole
      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
      : isLowerRank
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
        : 'bg-secondary text-secondary-foreground',
    'cursor-pointer ring-offset-background hover:ring-2 hover:ring-ring hover:ring-offset-1',
  )

  if (isPending) {
    return (
      <span className={cn(badgeClass, 'pointer-events-none opacity-70')}>
        <Loader2 className="h-3 w-3 animate-spin" />
        {displayName}
      </span>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(badgeClass, 'outline-none focus-visible:ring-1 focus-visible:ring-ring/50')}>
        {displayName}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44 p-1">
        <p className="px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
          Assign role
        </p>
        <DropdownMenuSeparator />
        {roles.length === 0 ? (
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            No assignable roles
          </div>
        ) : (
          roles.map((role) => {
            const isSelected = role.id === selectedRoleId
            return (
              <DropdownMenuItem
                key={role.id}
                onClick={() => !isSelected && handleSelect(role)}
                className="flex items-center justify-between gap-2 text-xs"
                disabled={isPending}
              >
                <span>{role.name}</span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-primary ml-2 shrink-0" />
                )}
              </DropdownMenuItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
