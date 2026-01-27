import { db } from '@/shared/lib/db'
// import { sendMessage } from './send-message' // Avoid circular dependency if possible

const RETRY_INTERVAL_MS = 10000 // 10 seconds
const STALE_THRESHOLD_MS = 5000 // 5 seconds

export function startOutboxRetryWorker() {
  const intervalId = setInterval(async () => {
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
  // Dynamic import to avoid circular dependencies
  const { wsManager } = await import('@/shared/ws/transport-manager')
  const { ClientEventName } = await import('@/shared/ws/protocol')

  console.log(`[OutboxWorker] Retrying: ${item.dedupeId}`)

  wsManager.emit(ClientEventName.SendMessage, {
    conversationId: item.conversationId,
    content: item.payload.content,
    dedupeId: item.dedupeId,
  })
}
