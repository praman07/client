import { useNavigate } from '@tanstack/react-router'
import { Building2, ChevronRight, LogIn, Mail, Plus } from 'lucide-react'
import { useUserHome } from '../hooks/use-user-home'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { Button } from '@/shared/ui/primitives/button'
import { Badge } from '@/shared/ui/primitives/badge'
import { Skeleton } from '@/shared/ui/primitives/skeleton'

export function HomePage() {
  const navigate = useNavigate()
  const { data, isLoading } = useUserHome()

  const homeData = data?.userHome
  const user = homeData?.user
  const workspaces = homeData?.workspaces ?? []
  const pendingInvites = homeData?.pendingInvites ?? []

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo2.png" alt="Collabify" className="h-7 w-7 rounded-lg object-contain" />
            <span className="font-semibold text-sm">Collabify</span>
          </div>
          <Button
            size="sm"
            onClick={() => void navigate({ to: '/onboarding' })}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Workspace
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Greeting */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Skeleton className="h-14 w-14 rounded-full" />
          ) : (
            <Avatar className="h-14 w-14 ring-2 ring-border">
              <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.fullName ?? 'User'} />
              <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
            </Avatar>
          )}
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-7 w-48 mb-1" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight">
                  {greeting()}, {user?.fullName?.split(' ')[0] ?? 'there'} 👋
                </h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </>
            )}
          </div>
        </div>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Pending invitations</h2>
              <Badge variant="secondary" className="text-xs">{pendingInvites.length}</Badge>
            </div>
            <div className="space-y-2">
              {pendingInvites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between rounded-xl border bg-card p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{invite.workspaceName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{invite.role} role</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => void navigate({
                      to: '/workspace/$workspaceSlug',
                      params: { workspaceSlug: invite.token },
                    })}
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Accept
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Workspaces */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-base font-semibold">Your workspaces</h2>
              {!isLoading && (
                <Badge variant="secondary" className="text-xs">{workspaces.length}</Badge>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No workspaces yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1 mb-4">
                Create your first workspace to start collaborating
              </p>
              <Button
                size="sm"
                onClick={() => void navigate({ to: '/onboarding' })}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Create workspace
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => void navigate({
                    to: '/workspace/$workspaceSlug',
                    params: { workspaceSlug: ws.slug },
                  })}
                  className="group relative flex items-start gap-3 rounded-xl border bg-card p-4 text-left hover:bg-accent/50 hover:border-border/80 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Avatar className="h-10 w-10 rounded-lg shrink-0">
                    <AvatarImage src={ws.logoUrl ?? undefined} alt={ws.name} />
                    <AvatarFallback className="rounded-lg text-sm font-semibold">
                      {ws.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{ws.name}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{ws.memberRole}</p>
                    <p className="text-xs text-muted-foreground/60 font-mono mt-0.5 truncate">/{ws.slug}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-muted-foreground transition-colors" />
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
