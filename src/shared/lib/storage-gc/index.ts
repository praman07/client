import { db } from '@/shared/lib/db'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('db:gc')

const GC_INTERVAL_MS = 24 * 60 * 60 * 1000 // 24 Hours
const MESSAGE_RETENTION_MS = 30 * 24 * 60 * 60 * 1000 // 30 Days
const FAILED_OUTBOX_RETENTION_MS = 24 * 60 * 60 * 1000 // 24 Hours

export function startStorageGarbageCollector() {
  const runGC = async () => {
    try {
      log.debug('Starting Garbage Collection...')
      const now = Date.now()

      // Architecture: Message Retention Policy
      // We enforce a hard cap of 30 days to prevent IndexedDB from hitting
      // storage quotas on mobile devices.
      const messageThreshold = now - MESSAGE_RETENTION_MS

      // TODO (Perf): Add 'createdAt' index to 'messages' schema in v5 migration.
      // Current implementation uses a full table scan (.filter) which is acceptable
      // for a low-frequency background job but will scale poorly > 100k messages.
      const oldMessages = await db.messages
        .filter((msg) => {
          const ts = new Date(msg.createdAt).getTime()
          return ts < messageThreshold
        })
        .primaryKeys()

      if (oldMessages.length > 0) {
        // Strategy: Batch delete to avoid locking the UI thread
        await db.messages.bulkDelete(oldMessages)
        log.debug(`Deleted ${oldMessages.length} old messages`)
      }

      // Architecture: Outbox Hygiene
      // Failed messages are kept for 24h for potential manual retry/inspection,
      // then discarded to keep the 'pending' query fast.
      const outboxThreshold = now - FAILED_OUTBOX_RETENTION_MS
      const oldOutbox = await db.outbox
        .where('status')
        .equals('failed')
        .and((item) => item.createdAt < outboxThreshold)
        .primaryKeys()

      if (oldOutbox.length > 0) {
        await db.outbox.bulkDelete(oldOutbox)
        log.debug(`Deleted ${oldOutbox.length} failed outbox items`)
      }
    } catch (err) {
      log.error('Failed', err)
    }
  }

  // Strategy: Boot Deferral
  // We offset execution by 60s to prioritize TTI (Time to Interactive)
  // and critical initial sync operations.
  const initialTimer = setTimeout(runGC, 60 * 1000)

  // Schedule Periodic
  const interval = setInterval(runGC, GC_INTERVAL_MS)

  return () => {
    clearTimeout(initialTimer)
    clearInterval(interval)
  }
}
