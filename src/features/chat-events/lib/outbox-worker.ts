import { db } from '@/shared/lib/db'

import { leaderElection } from '@/shared/lib/broadcast/leader-election'

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

      console.debug(`[OutboxWorker] Found ${pendingItems.length} stale items`)

      for (const item of pendingItems) {
        try {
          await retryItem(item)
        } catch (e) {
          console.error(`[OutboxWorker] Retry failed for ${item.dedupeId}`, e)
        }
      }
    } catch (error) {
      console.error('[OutboxWorker] Loop Failed', error)
    }
  }, RETRY_INTERVAL_MS)

  return () => clearInterval(intervalId)
}

async function retryItem(item: any) {
  const MAX_RETRIES = 5
  const currentRetries = item.retryCount || 0

  if (currentRetries >= MAX_RETRIES) {
    console.error(
      `[OutboxWorker] Max retries (${MAX_RETRIES}) reached for ${item.dedupeId}. marking as failed.`,
    )
    await db.outbox.update(item.id, { status: 'failed' })
    return
  }

  // Increment Retry Count
  await db.outbox.update(item.id, { retryCount: currentRetries + 1 })

  // Dynamic import to avoid circular dependencies
  const { wsManager } = await import('@/shared/ws')
  const { ClientEventName } = await import('@/shared/ws/protocol')

  console.log(
    `[OutboxWorker] Retrying: ${item.dedupeId} (Attempt ${currentRetries + 1})`,
  )

  const payloadContent = item.payload.content
  const safeContent =
    typeof payloadContent === 'string'
      ? payloadContent
      : payloadContent?.text || JSON.stringify(payloadContent)

  wsManager.emit(ClientEventName.SendMessage, {
    conversationId: item.conversationId,
    content: safeContent,
    dedupeId: item.dedupeId,
  })
}
