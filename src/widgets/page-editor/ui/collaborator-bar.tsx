import type { PageCollaboratorPresence } from '@/entities/page-presence'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui/primitives/tooltip'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import { useAppSelector } from '@/shared/hooks'
import { selectPageCollaborators } from '@/entities/page-presence'

/**
 * CollaboratorBar — shows who is currently viewing/editing this page.
 * Reads from Redux (set by WS subscribe-success + user-joined/user-left handlers).
 * Tiptap renders cursor labels natively — this bar is for the avatar strip only.
 *
 * @layer Widgets
 */
export function CollaboratorBar() {
  const collaborators = useAppSelector(selectPageCollaborators)

  if (collaborators.length === 0) return null

  return (
    <div className="flex items-center gap-1 mb-4">
      {collaborators.slice(0, 8).map((collab) => (
        <CollaboratorAvatar key={collab.userId} collab={collab} />
      ))}
      {collaborators.length > 8 && (
        <span className="text-xs text-muted-foreground ml-1">
          +{collaborators.length - 8} more
        </span>
      )}
    </div>
  )
}

function CollaboratorAvatar({ collab }: { collab: PageCollaboratorPresence }) {
  const initials = collab.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Tooltip>
      <TooltipTrigger>
        <Avatar
          className="h-7 w-7 ring-2 transition-transform hover:scale-110 cursor-default"
          style={{ borderColor: collab.color }}
        >
          {collab.avatarUrl && (
            <AvatarImage src={collab.avatarUrl} alt={collab.fullName} />
          )}
          <AvatarFallback
            className="text-xs font-medium text-white"
            style={{ backgroundColor: collab.color }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span>{collab.fullName}</span>
        {collab.isIdle && (
          <span className="ml-1 text-muted-foreground">(idle)</span>
        )}
      </TooltipContent>
    </Tooltip>
  )
}
