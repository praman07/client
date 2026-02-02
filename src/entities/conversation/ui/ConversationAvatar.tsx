import { Hash, Lock, MessageCircle, MessagesSquare, Users } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { ConversationType } from '..'

interface ConversationAvatarProps {
  type: ConversationType
  isArchived?: boolean
  className?: string
}

/**
 * Conversation avatar icon
 * Shows appropriate icon based on conversation type
 */
export function ConversationAvatar({
  type,
  isArchived,
  className,
}: ConversationAvatarProps) {
  // Archived conversations show lock icon
  if (isArchived) {
    return <Lock className={cn('w-4 h-4 text-muted-foreground', className)} />
  }

  // Show icon based on conversation type
  switch (type) {
    case 'CHANNEL':
      return <Hash className={cn('w-4 h-4 text-foreground', className)} />
    case 'DM':
      return (
        <MessageCircle className={cn('w-4 h-4 text-foreground', className)} />
      )
    case 'GROUP_DM':
      return <Users className={cn('w-4 h-4 text-foreground', className)} />
    case 'THREAD':
      return (
        <MessagesSquare className={cn('w-4 h-4 text-foreground', className)} />
      )
    default:
      return <Hash className={cn('w-4 h-4 text-foreground', className)} />
  }
}
