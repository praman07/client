import { cn } from '@/shared/lib/utils'

interface ConversationTopicProps {
  topic?: string | null
  className?: string
}

export function ConversationTopic({
  topic,
  className,
}: ConversationTopicProps) {
  if (!topic) return null

  return (
    <p className={cn('text-11 text-secondary truncate', className)}>
      {topic}
    </p>
  )
}
