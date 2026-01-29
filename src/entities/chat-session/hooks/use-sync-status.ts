import { useState, useEffect } from 'react'
import { resequencer } from '../lib/resequencer/coordinator'
import type { ResequencerStatus } from '../lib/resequencer/types'

export function useSyncStatus(conversationId: string): ResequencerStatus {
  const [status, setStatus] = useState<ResequencerStatus>('SYNCED')

  useEffect(() => {
    // Poll resequencer status every 500ms
    const interval = setInterval(() => {
      const currentStatus = resequencer.getStatus(conversationId)
      setStatus(currentStatus)
    }, 500)

    // Initial fetch
    const initialStatus = resequencer.getStatus(conversationId)
    setStatus(initialStatus)

    return () => clearInterval(interval)
  }, [conversationId])

  return status
}
