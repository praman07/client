import React from 'react'
import { cn } from '@/shared/lib/utils'

interface ChannelTopicProps {
  topic?: string | null
  className?: string
}

export function ChannelTopic({ topic, className }: ChannelTopicProps) {
  if (!topic) return null

  return (
    <p className={cn('text-xs text-muted-foreground truncate', className)}>
      {topic}
    </p>
  )
}
