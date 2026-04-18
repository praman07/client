import { HugeiconsIcon } from '@hugeicons/react'
import {
  HashtagIcon,
  LockKeyIcon,
} from '@hugeicons/core-free-icons'
import {
  ChatHeaderMain,
  ChatHeader as ChatHeaderRoot,
  ChatHeaderStart,
} from './components/chat-layout'
import { useChannelSettings } from '@/widgets/channel-settings-modal'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'

interface ChatHeaderProps {
  channelId: string
  channelName?: string
  isPrivate?: boolean
  topic?: string
  isDm?: boolean
  otherUser?: {
    fullName?: string | null
    avatarUrl?: string | null
  }
  children?: React.ReactNode
}

export function ChatHeader({
  channelId,
  channelName = 'general',
  isPrivate = false,
  topic,
  isDm = false,
  otherUser,
  children,
}: ChatHeaderProps) {
  const { open: openChannelSettings } = useChannelSettings()

  if (isDm && otherUser) {
    const displayName = otherUser.fullName ?? 'Unknown User'
    const initials = displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

    return (
      <ChatHeaderRoot className="border-b">
        <ChatHeaderStart>
          <Avatar className="h-7 w-7 rounded-md">
            <AvatarImage
              src={otherUser.avatarUrl ?? undefined}
              alt={displayName}
            />
            <AvatarFallback className="rounded-md text-[10px]">
              {initials}
            </AvatarFallback>
          </Avatar>
        </ChatHeaderStart>
        <ChatHeaderMain>
          <h2 className="text-sm font-semibold truncate max-w-[200px]">
            {displayName}
          </h2>
          {children}
        </ChatHeaderMain>
      </ChatHeaderRoot>
    )
  }

  return (
    <ChatHeaderRoot className="border-b">
      <ChatHeaderStart>
        <HugeiconsIcon
          icon={isPrivate ? LockKeyIcon : HashtagIcon}
          className="text-secondary size-5"
        />
      </ChatHeaderStart>

      <ChatHeaderMain>
        <div className="flex items-center gap-2">
          <h2
            className="text-sm font-semibold truncate max-w-[200px] cursor-pointer hover:underline"
            onClick={() => openChannelSettings(channelId)}
          >
            {channelName}
          </h2>
          <span className="text-11 bg-accent-subtle px-1.5 py-0.5 rounded-md text-secondary font-medium uppercase tracking-wider">
            {isPrivate ? 'Private' : 'Public'}
          </span>
        </div>
        {topic && (
          <span className="text-11 text-secondary truncate max-w-[300px]">
            {topic}
          </span>
        )}
        {children}
      </ChatHeaderMain>
    </ChatHeaderRoot>
  )
}
