import { cn } from '@/shared/lib/utils'

interface InviteRoleBadgeProps {
  role: string  // role display name e.g. "Member", "Admin"
}

function getRoleBadgeClass(roleName: string): string {
  const name = roleName.toUpperCase()
  if (name === 'OWNER')
    return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  if (name === 'ADMIN')
    return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
  if (name === 'GUEST')
    return 'bg-muted/50 text-muted-foreground/70 border-border/50'
  return 'bg-muted/80 text-muted-foreground border-border'
}

export function InviteRoleBadge({ role }: InviteRoleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        getRoleBadgeClass(role),
      )}
    >
      {role}
    </span>
  )
}
