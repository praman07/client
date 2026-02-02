import { HugeiconsIcon } from '@hugeicons/react'
import {
  CallIcon,
  HashtagIcon,
  LockKeyIcon,
  Search01Icon,
  Settings01Icon,
  VideoReplayIcon,
} from '@hugeicons/core-free-icons'
import {
  ChatHeaderEnd,
  ChatHeaderMain,
  ChatHeader as ChatHeaderRoot,
  ChatHeaderStart,
} from './components/chat-layout'
import { Button } from '@/shared/ui/primitives/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/shared/ui/primitives/input-group'
import { Avatar, AvatarFallback } from '@/shared/ui/primitives/avatar'

interface ChatHeaderProps {
  channelName?: string
  isPrivate?: boolean
  description?: string
  memberCount?: number
  children?: React.ReactNode
}

export function ChatHeader({
  channelName = 'general',
  isPrivate = false,
  description = 'General discussion',
  memberCount = 24,
  children,
}: ChatHeaderProps) {
  return (
    <ChatHeaderRoot className="border-b">
      <ChatHeaderStart>
        <HugeiconsIcon
          icon={isPrivate ? LockKeyIcon : HashtagIcon}
          className="text-muted-foreground size-5"
        />
      </ChatHeaderStart>

      <ChatHeaderMain>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold truncate max-w-[200px]">
            {channelName}
          </h2>
          <span className="text-[10px] bg-accent px-1.5 py-0.5 rounded text-muted-foreground font-medium uppercase tracking-wider">
            {isPrivate ? 'Private' : 'Public'}
          </span>
        </div>
        {description && (
          <span className="text-xs text-muted-foreground truncate max-w-[300px]">
            {description}
          </span>
        )}
        {children}
      </ChatHeaderMain>

      <ChatHeaderEnd>
        <InputGroup className="hidden @2xl/chat:flex w-48 xl:w-64">
          <InputGroupInput placeholder="Search messages..." />
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} className="size-4" />
          </InputGroupAddon>
        </InputGroup>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 hidden @2xl/chat:inline-flex"
          >
            <HugeiconsIcon icon={CallIcon} className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 hidden @2xl/chat:inline-flex"
          >
            <HugeiconsIcon icon={VideoReplayIcon} className="size-4" />
          </Button>

          <div className="flex -space-x-2 ml-2 mr-1">
            <Avatar className="size-6 border-2 border-background">
              <AvatarFallback className="text-[8px]">U1</AvatarFallback>
            </Avatar>
            <Avatar className="size-6 border-2 border-background">
              <AvatarFallback className="text-[8px]">U2</AvatarFallback>
            </Avatar>
            <div className="size-6 rounded-full border-2 border-background bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[8px] font-medium">
              +{memberCount}
            </div>
          </div>

          <Button variant="ghost" size="icon" className="size-8">
            <HugeiconsIcon icon={Settings01Icon} className="size-4" />
          </Button>
        </div>
      </ChatHeaderEnd>
    </ChatHeaderRoot>
  )
}
