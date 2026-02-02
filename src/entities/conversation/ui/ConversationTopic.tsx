import { cn } from '@/shared/lib/utils'

interface ConversationTopicProps {
  topic?: string | null
  className?: string
}

/**
 * Conversation topic display
 * Shows conversation topic/description
 */
export function ConversationTopic({
  topic,
  className,
}: ConversationTopicProps) {
  if (!topic) return null

  return (
    <p className={cn('text-xs text-muted-foreground truncate', className)}>
      {topic}
    </p>
  )
}
