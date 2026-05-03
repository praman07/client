import { cn } from '@/shared/lib/utils'

interface InviteRoleBadgeProps {
  role: string  // role display name e.g. "Member", "Admin"
}

function getRoleBadgeClass(roleName: string): string {
  const name = roleName.toUpperCase()
  if (name === 'OWNER')
    return 'bg-warning-subtle text-warning-primary border-warning-subtle'
  if (name === 'ADMIN')
    return 'bg-accent-subtle text-accent-primary border-accent-subtle'
  if (name === 'GUEST')
    return 'bg-layer-2 text-tertiary border-subtle'
  return 'bg-layer-2 text-secondary border-subtle'
}

export function InviteRoleBadge({ role }: InviteRoleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-11 font-medium',
        getRoleBadgeClass(role),
      )}
    >
      {role}
    </span>
  )
}
