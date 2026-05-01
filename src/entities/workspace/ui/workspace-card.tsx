import { Link } from '@tanstack/react-router'
import type { WorkspaceFragmentFragment } from '@/gql/graphql'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { Badge } from '@/shared/ui/primitives/badge'
import { Card, CardContent } from '@/shared/ui/primitives/card'

export interface WorkspaceCardProps {
  workspace: WorkspaceFragmentFragment
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <Link
      to="/workspace/$workspaceSlug"
      params={{ workspaceSlug: workspace.slug }}
      className="block outline-none cursor-pointer group h-full"
    >
      <Card size="sm" className="h-full hover:border-accent-strong transition-colors duration-300 shadow-raised-100 active:scale-[0.98] hardware-accelerated">
        <CardContent>
          <div className="flex items-start justify-between gap-3">
            <Avatar className="w-12 h-12 rounded-lg bg-layer-2 border border-subtle shrink-0">
              <AvatarImage src={workspace.logoUrl ?? undefined} alt={workspace.name} />
              <AvatarFallback className="rounded-lg text-18 font-semibold text-primary">
                {workspace.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {workspace.memberRole && (
              <Badge variant="default" className="px-1.5 py-0.5 text-10 font-semibold uppercase tracking-wide">
                {workspace.memberRole}
              </Badge>
            )}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-primary group-hover:text-accent-primary transition-colors line-clamp-1">
              {workspace.name}
            </h3>
            <p className="text-11 text-secondary mt-1 font-mono truncate">
              /{workspace.slug}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
