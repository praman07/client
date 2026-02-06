import { db } from '@/shared/lib/db'

import { leaderElection } from '@/shared/lib/broadcast/leader-election'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:outbox')

const RETRY_INTERVAL_MS = 10000 // 10 seconds
const STALE_THRESHOLD_MS = 5000 // 5 seconds

export function startOutboxRetryWorker() {
  const intervalId = setInterval(async () => {
    // Guard: Only Leader should process retries
    if (!leaderElection.isLeader()) return

    try {
      const now = Date.now()
      const threshold = now - STALE_THRESHOLD_MS

      // Find pending messages that are older than threshold
      const pendingItems = await db.outbox
        .where('status')
        .equals('pending')
        .and((item) => item.createdAt < threshold)
        .toArray()

      if (pendingItems.length === 0) return

      log.debug(`Found ${pendingItems.length} stale items`)

      for (const item of pendingItems) {
        try {
          await retryItem(item)
        } catch (e) {
          log.error(`Retry failed for ${item.dedupeId}`, e)
        }
      }
    } catch (error) {
      log.error('Loop Failed', error)
    }
  }, RETRY_INTERVAL_MS)

  return () => clearInterval(intervalId)
}

async function retryItem(item: any) {
  const MAX_RETRIES = 5
  const currentRetries = item.retryCount || 0

  if (currentRetries >= MAX_RETRIES) {
    log.error(
      `Max retries (${MAX_RETRIES}) reached for ${item.dedupeId}. marking as failed.`,
    )
    await db.outbox.update(item.id, { status: 'failed' })
    return
  }

  // Increment Retry Count
  await db.outbox.update(item.id, { retryCount: currentRetries + 1 })

  // Dynamic import to avoid circular dependencies
  const { wsManager } = await import('@/shared/ws')
  const { ChatUpstreamEvent } = await import('@/shared/contracts/chat/upstream')

  log.debug(`Retrying: ${item.dedupeId} (Attempt ${currentRetries + 1})`)

  const payloadContent = item.payload.content
  const safeContent =
    typeof payloadContent === 'string'
      ? payloadContent
      : payloadContent?.text || JSON.stringify(payloadContent)

  wsManager.emit(ChatUpstreamEvent.SendMessage, {
    conversationId: item.conversationId,
    content: safeContent,
    dedupeId: item.dedupeId,
  })
}
