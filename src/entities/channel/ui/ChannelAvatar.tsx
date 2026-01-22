import React from 'react'
import { Hash, Lock, Users } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { ChannelType } from '../model/types'

interface ChannelAvatarProps {
  type: ChannelType
  isArchived?: boolean
  className?: string
}

export function ChannelAvatar({
  type,
  isArchived,
  className,
}: ChannelAvatarProps) {
  if (isArchived) {
    return <Lock className={cn('w-4 h-4 text-muted-foreground', className)} />
  }

  switch (type) {
    case 'PROJECT':
      return <Hash className={cn('w-4 h-4 text-foreground', className)} />
    case 'DM':
    case 'GROUP_DM':
      return <Users className={cn('w-4 h-4 text-foreground', className)} />
    default:
      return <Hash className={cn('w-4 h-4 text-foreground', className)} />
  }
}
