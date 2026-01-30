import { db } from '@/shared/lib/db'
import type { DBMessage, OutboxItem } from '@/shared/lib/db/schema'
import type { MessageRowData } from './message-list.types'

/**
 * Gets the Min and Max sequence for a conversation currently in DB.
 * Used to determine the valid window headers.
 */
export async function getSequenceRange(
  conversationId: string,
): Promise<{ min: number; max: number }> {
  try {
    const lastMsg = await db.messages
      .where('[conversationId+sequence]')
      .between([conversationId, -Infinity], [conversationId, Infinity])
      .last()

    const firstMsg = await db.messages
      .where('[conversationId+sequence]')
      .between([conversationId, -Infinity], [conversationId, Infinity])
      .first()

    return {
      min: firstMsg?.sequence ?? 0,
      max: lastMsg?.sequence ?? 0,
    }
  } catch (error) {
    console.error('[MessageSelectors] Metrics failure', error)
    return { min: 0, max: 0 }
  }
}

/**
 * Merges History (Committed) and Outbox (Optimistic)
 * - De-duplicates based on dedupeId
 * - Sorts by Sequence (Primary) and CreatedAt (Secondary fbk)
 */
export function mergeMessages(
  history: DBMessage[],
  outbox: OutboxItem[],
): MessageRowData[] {
  const historyMap = new Map<string, MessageRowData>()

  // 1. Convert History to Rows
  for (const msg of history) {
    const row: MessageRowData = {
      ...msg,
      deliveryStatus: 'delivered', // Committed = Delivered
      isOptimistic: false,
      virtualId: msg.streamId || msg.id, // Fallback if streamId missing
    }
    historyMap.set(msg.dedupeId || msg.streamId || msg.id, row)
  }

  // 2. Merge Outbox (if not already in history)
  const rows = Array.from(historyMap.values())

  for (const p of outbox) {
    // If we already have this dedupeId in history, it means it was committed
    // but the outbox entry hasn't been deleted yet (race condition).
    // Trust History.
    if (!historyMap.has(p.dedupeId)) {
      rows.push({
        id: p.id ? String(p.id) : `opt-${p.dedupeId}`, // ID must be string
        conversationId: p.conversationId,
        streamId: `temp-${p.dedupeId}`, // Placeholder streamId
        sequence: Infinity, // Optimistic items always at end
        content: p.payload?.content || '', // Extract content from payload
        authorId: p.authorId,
        createdAt: new Date(p.createdAt).toISOString(), // Convert timestamp to ISO
        updatedAt: new Date(p.createdAt).toISOString(),
        projectId: p.projectId,
        deliveryStatus: (p.status || 'pending') as any,
        isOptimistic: true,
        virtualId: p.dedupeId,
        reactions: [],
        replyCount: 0,
      })
    }
  }

  // 3. Sort
  return rows.sort((a, b) => {
    // Primary: Sequence
    const seqDiff = (a.sequence || 0) - (b.sequence || 0)
    if (seqDiff !== 0) return seqDiff

    // Secondary: Creation Time (for optimistic items at end)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })
}
