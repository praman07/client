import { HugeiconsIcon } from '@hugeicons/react'
import {
  HashtagIcon,
  LockKeyIcon,
  Settings01Icon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/shared/ui/primitives/button'
import { Separator } from '@/shared/ui/primitives/separator'

interface ChatHeaderProps {
  channelName?: string
  isPrivate?: boolean
  description?: string
  memberCount?: number
}

export function ChatHeader({
  channelName = 'general',
  isPrivate = false,
  description = 'General discussion',
  memberCount = 24,
}: ChatHeaderProps) {
  return (
    <div className="flex flex-col">
      <div className="flex h-14 items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={isPrivate ? LockKeyIcon : HashtagIcon}
            className="text-muted-foreground"
          />
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold">{channelName}</h2>
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {/* Dummy Avatars */}
            <div className="h-6 w-6 rounded-full border-2 border-background bg-zinc-300" />
            <div className="h-6 w-6 rounded-full border-2 border-background bg-zinc-400" />
            <div className="h-6 w-6 rounded-full border-2 border-background bg-zinc-500 flex items-center justify-center text-[10px] text-white">
              +{memberCount}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HugeiconsIcon icon={Settings01Icon} className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Separator />
    </div>
  )
}
