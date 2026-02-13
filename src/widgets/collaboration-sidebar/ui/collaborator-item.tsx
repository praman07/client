import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/primitives/avatar'
import { Badge } from '@/shared/ui/primitives/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui/primitives/tooltip'
import { CursorPreview } from './cursor-preview'
import type { CollaboratorPresence } from '../hooks/use-sorted-collaborators'

interface CollaboratorItemProps {
  collaborator: CollaboratorPresence
}

/**
 * Format time distance (simple version without date-fns)
 */
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

/**
 * Collaborator list item showing user info and presence status
 * 
 * Features:
 * - Avatar with cursor color ring
 * - Name truncation
 * - Activity status badge
 * - Hover tooltip with full info
 * 
 * @layer Widgets
 * @module collaboration-sidebar
 */
export function CollaboratorItem({ collaborator }: CollaboratorItemProps) {
  const initials = collaborator.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const lastActivityText = formatTimeAgo(collaborator.lastActivity)

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-sidebar-accent/50 transition-all duration-200 cursor-default group w-full">
          {/* Avatar with cursor color ring */}
          <div className="relative">
            <Avatar 
              className="h-8 w-8 ring-2 ring-offset-1 ring-offset-sidebar transition-transform group-hover:scale-105"
              style={{ 
                '--tw-ring-color': collaborator.cursor.color 
              } as React.CSSProperties}
            >
              <AvatarImage src={collaborator.avatarUrl} alt={collaborator.fullName} />
              <AvatarFallback className="text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Status indicator dot */}
            <div
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-sidebar ${
                collaborator.isActive ? 'bg-green-500' : 'bg-muted-foreground/40'
              }`}
            />
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate leading-tight text-left">
              {collaborator.fullName}
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate leading-tight mt-0.5 text-left">
              {collaborator.isActive ? 'Active' : 'Idle'}
            </p>
          </div>

          {/* Cursor preview */}
          <CursorPreview color={collaborator.cursor.color} />
        </div>
      </TooltipTrigger>

      <TooltipContent side="left" className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold">{collaborator.fullName}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge 
              variant={collaborator.isActive ? 'default' : 'secondary'}
              className="h-5"
            >
              {collaborator.isActive ? 'Active' : 'Idle'}
            </Badge>
            <span>•</span>
            <span>Joined {lastActivityText}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
