import React from 'react'
import { format } from 'date-fns'
import { cn } from '@/shared/lib/utils'

interface MessageTimestampProps {
  date: string // ISO String
  formatStr?: string
  className?: string
}

export function MessageTimestamp({
  date,
  formatStr = 'h:mm a',
  className,
}: MessageTimestampProps) {
  const dateObj = new Date(date)
  return (
    <span
      className={cn(
        'text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap',
        className,
      )}
    >
      {format(dateObj, formatStr)}
    </span>
  )
}
