import { Hash, Lock, MessageCircle, MessagesSquare, Users } from 'lucide-react'
import type { ConversationType } from '..'
import { cn } from '@/shared/lib/utils'

interface ConversationAvatarProps {
  type: ConversationType
  isArchived?: boolean
  className?: string
}

export function ConversationAvatar({
  type,
  isArchived,
  className,
}: ConversationAvatarProps) {
  if (isArchived) {
    return <Lock className={cn('w-4 h-4 text-secondary', className)} />
  }

  switch (type) {
    case 'CHANNEL':
      return <Hash className={cn('w-4 h-4 text-primary', className)} />
    case 'DM':
      return (
        <MessageCircle className={cn('w-4 h-4 text-primary', className)} />
      )
    case 'GROUP_DM':
      return <Users className={cn('w-4 h-4 text-primary', className)} />
    case 'THREAD':
      return (
        <MessagesSquare className={cn('w-4 h-4 text-primary', className)} />
      )
    default:
      return <Hash className={cn('w-4 h-4 text-primary', className)} />
  }
}
