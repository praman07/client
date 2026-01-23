import React from 'react'
import type { UserPresenceStatus } from '../model/types'
import { cn } from '@/shared/lib/utils'

interface StatusDotProps {
  status: UserPresenceStatus
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function StatusDot({ status, className, size = 'md' }: StatusDotProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  const statusColor = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-slate-300 dark:bg-slate-600',
  }

  return (
    <div
      className={cn(
        'rounded-full border-2 border-background ring-1 ring-background',
        sizeClasses[size],
        statusColor[status],
        className,
      )}
      title={status}
    />
  )
}
