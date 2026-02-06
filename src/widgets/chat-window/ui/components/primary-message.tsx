import {
  MessageEvent,
  MessageEventAddon,
  MessageEventBody,
  MessageEventContent,
  MessageEventDescription,
  MessageEventTitle,
} from './message'
import type { MessageRowData } from '../../model/message-list.types'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { cn } from '@/shared/lib/utils'
import { useMemberCache } from '../../lib/member-cache-context'
import { getInitials } from '../../lib/get-initials'

function getSafeContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (content && typeof content === 'object' && 'text' in content) {
    return (content as { text: string }).text
  }
  return JSON.stringify(content)
}

interface PrimaryMessageProps {
  message: MessageRowData
  className?: string
}

export function PrimaryMessage({
  message,
  className,
}: PrimaryMessageProps) {
  const { getMemberInfo } = useMemberCache()
  const memberInfo = getMemberInfo(message.authorId)

  // console.log('[PrimaryMessage] Looking up authorId:', message.authorId)
  // console.log('[PrimaryMessage] Found memberInfo:', memberInfo)

  // Display name: use fullName if available, fallback to authorId
  const displayName = memberInfo?.fullName ?? message.authorId

  // Avatar initials: extract from fullName if available, otherwise from authorId
  const initials = memberInfo
    ? getInitials(memberInfo.fullName)
    : (message.authorId || '?').substring(0, 2).toUpperCase()

  // console.log('[PrimaryMessage] Display name:', displayName, 'Initials:', initials)

  return (
    <MessageEvent className={cn('hover:bg-accent/50', className)}>
      <MessageEventAddon>
        <Avatar className="rounded-full size-8 @md/chat:size-10 mx-auto border shadow-sm">
          {memberInfo?.avatarUrl && (
            <AvatarImage src={memberInfo.avatarUrl} alt={displayName} />
          )}
          <AvatarFallback className="text-xs font-bold bg-muted">
            {initials}
          </AvatarFallback>
        </Avatar>
      </MessageEventAddon>
      <MessageEventBody>
        <div className="flex items-baseline gap-2">
          <MessageEventTitle className="hover:underline cursor-pointer">
            {displayName}
          </MessageEventTitle>
          <MessageEventDescription>
            {new Intl.DateTimeFormat('en-US', {
              timeStyle: 'short',
            }).format(new Date(message.createdAt))}
          </MessageEventDescription>
        </div>
        <MessageEventContent>
          {getSafeContent(message.content)}
        </MessageEventContent>
      </MessageEventBody>
    </MessageEvent>
  )
}
