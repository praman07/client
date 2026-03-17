import { useState } from 'react'
import { Check, ChevronDown, Loader2 } from 'lucide-react'
import { useUpdateProjectMemberRole } from '../hooks/use-update-project-member-role'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

interface Role {
  id: string
  name: string
  rank: number
}

interface RoleSelectorCellProps {
  userId: string
  projectId: string
  workspaceId: string
  /** Member's current role name string (from GraphQL ProjectMember.role) */
  currentRoleName: string | null
  /** Assignable project roles (system roles excluded, sorted by rank) */
  roles: Array<Role>
}

/**
 * Renders the member's role as a styled badge.
 * For Managers viewing another member's row, the badge is clickable:
 * hover reveals a ChevronDown, click opens a DropdownMenu of available roles.
 *
 * @layer Feature — update-project-member-role
 */
export function RoleSelectorCell({
  userId,
  projectId,
  workspaceId,
  currentRoleName,
  roles,
}: RoleSelectorCellProps) {
  const { mutate: updateRole, isPending } = useUpdateProjectMemberRole()

  const initialRole = roles.find(
    (r) => r.name.toLowerCase() === (currentRoleName ?? '').toLowerCase(),
  )
  const [optimisticRoleName, setOptimisticRoleName] = useState<string | null>(
    initialRole?.name ?? currentRoleName,
  )

  function handleSelect(role: Role) {
    const prev = optimisticRoleName
    setOptimisticRoleName(role.name)
    updateRole(
      { projectId, workspaceId, userId, roleId: role.id },
      { onError: () => setOptimisticRoleName(prev) },
    )
  }

  const displayName = optimisticRoleName ?? 'No role'

  // Badge colour — mirrors RoleBadge in the table
  const badgeClass = cn(
    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors',
    displayName.toUpperCase() === 'CONTRIBUTOR'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      : 'bg-secondary text-secondary-foreground',
    // Hover ring to hint it's interactive
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
      <DropdownMenuTrigger className={badgeClass}>
        {displayName}
        <ChevronDown className="h-3 w-3 opacity-50 transition-opacity" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[140px]">
        {roles.length === 0 ? (
          <div className="px-2 py-1.5 text-xs text-muted-foreground">No roles available</div>
        ) : (
          roles.map((role) => (
            <DropdownMenuItem
              key={role.id}
              onClick={() => handleSelect(role)}
              className="text-xs flex items-center justify-between"
            >
              {role.name}
              {role.name.toLowerCase() === optimisticRoleName?.toLowerCase() && (
                <Check className="h-3.5 w-3.5 text-primary ml-2" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
