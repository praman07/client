import { useEffect, useState } from 'react'
import { resequencer } from '../lib/chat-resequencer'
import type { ResequencerStatus } from '@/entities/stream-session'

/**
 * Hook to subscribe to resequencer status changes.
 * Currently uses polling (simple) or relies on resequencer updates.
 * Ideally, Resequencer should emit 'status-changed' events.
 * For now, we poll on mount and expose a getter.
 */
export function useResequencerStatus(conversationId: string) {
  const [status, setStatus] = useState<ResequencerStatus>(
    resequencer.getStatus(conversationId),
  )

  useEffect(() => {
    // Initial fetch
    setStatus(resequencer.getStatus(conversationId))

    // Poll every 1s for status updates (Simple Observer)
    // TODO: Switch to EventBus 'resequencer:status-changed' for reactivity
    const interval = setInterval(() => {
      const current = resequencer.getStatus(conversationId)
      setStatus((prev) => (prev !== current ? current : prev))
    }, 1000)

    return () => clearInterval(interval)
  }, [conversationId])

  return status
}
