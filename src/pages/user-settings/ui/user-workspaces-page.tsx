import { useNavigate } from '@tanstack/react-router'
import { Building2, ChevronRight, Crown, Plus } from 'lucide-react'
import { useUserHome } from '@/pages/home/hooks/use-user-home'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { Badge } from '@/shared/ui/primitives/badge'
import { Button } from '@/shared/ui/primitives/button'
import { Skeleton } from '@/shared/ui/primitives/skeleton'

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  OWNER: { label: 'Owner', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  ADMIN: { label: 'Admin', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  MEMBER: { label: 'Member', color: 'bg-muted text-muted-foreground' },
  GUEST: { label: 'Guest', color: 'bg-muted text-muted-foreground' },
}

export function UserWorkspacesPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useUserHome()

  const workspaces = data?.userHome?.workspaces ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Workspaces</h2>
          <p className="text-sm text-muted-foreground mt-0.5">All workspaces you are a member of.</p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => void navigate({ to: '/onboarding' })}
        >
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-14 text-center">
          <Building2 className="h-9 w-9 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No workspaces yet</p>
          <Button
            size="sm"
            className="mt-4 gap-1.5"
            onClick={() => void navigate({ to: '/onboarding' })}
          >
            <Plus className="h-4 w-4" />
            Create workspace
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {workspaces.map((ws) => {
            const roleInfo = ROLE_LABELS[ws.memberRole] ?? ROLE_LABELS.MEMBER
            const isOwner = ws.memberRole === 'OWNER'
            return (
              <button
                key={ws.id}
                type="button"
                onClick={() => void navigate({
                  to: '/workspace/$workspaceSlug',
                  params: { workspaceSlug: ws.slug },
                })}
                className="group w-full flex items-center gap-3 rounded-xl border bg-card p-4 text-left hover:bg-accent/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="h-9 w-9 rounded-lg shrink-0">
                  <AvatarImage src={ws.logoUrl ?? undefined} alt={ws.name} />
                  <AvatarFallback className="rounded-lg text-sm font-semibold">
                    {ws.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate">{ws.name}</p>
                    {isOwner && <Crown className="h-3 w-3 text-amber-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground/60 font-mono mt-0.5 truncate">/{ws.slug}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs shrink-0 ${roleInfo.color}`}
                >
                  {roleInfo.label}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 group-hover:text-muted-foreground transition-colors" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
