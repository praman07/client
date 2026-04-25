import { Hash, MessageCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/primitives/alert'

interface ChannelGreetingBannerProps {
  type: 'CHANNEL' | 'DM'
  channelName: string
  createdAt?: string
  otherUser?: {
    fullName?: string | null
    avatarUrl?: string | null
  }
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

export function ChannelGreetingBanner({
  type,
  channelName,
  createdAt,
  otherUser,
}: ChannelGreetingBannerProps) {
  if (type === 'DM' && otherUser) {
    return (
      <Alert variant="info" className="m-3">
        <MessageCircle className="h-4 w-4 text-accent-primary" />
        <AlertTitle className="font-semibold">
          This conversation is just between @{otherUser.fullName} and you.
        </AlertTitle>
        <AlertDescription className="flex items-center gap-2 mt-1">
          {otherUser.avatarUrl && (
            <img
              src={otherUser.avatarUrl}
              alt={otherUser.fullName ?? ''}
              className="h-8 w-8 rounded-full"
            />
          )}
          <span className="text-secondary">
            Check out their profile to learn more about them.
          </span>
        </AlertDescription>
      </Alert>
    )
  }

  // CHANNEL case
  const dateText = createdAt ? `on ${formatDate(createdAt)}` : 'recently'

  return (
    <Alert variant="info" className="m-3">
      <Hash className="h-4 w-4 text-accent-primary" />
      <AlertTitle className="font-semibold">
        Welcome to #{channelName}
      </AlertTitle>
      <AlertDescription className="text-secondary">
        <p>
          You created this channel {dateText}. This is the very beginning of the #{channelName} channel.
        </p>
        <p className="mt-1">
          It's a great spot for announcements and team-wide conversations.
        </p>
      </AlertDescription>
    </Alert>
  )
}

export type { ChannelGreetingBannerProps }
