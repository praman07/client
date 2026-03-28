import type { OutboxItem } from '@/shared/lib/db/schema'
import type { SendMessageContract } from '@/shared/contracts/chat/upstream'
import { ChatUpstreamEvent } from '@/shared/contracts/chat/upstream'
import { db } from '@/shared/lib/db'
import { wsManager } from '@/shared/ws'

export async function sendMessage(
  content: string,
  channelId: string,
  projectId: string,
  authorId: string,
  parentMessageId?: string,
) {
  if (!content.trim()) return

  // 1. Generate Dedupe ID
  const dedupeId = crypto.randomUUID()
  const now = Date.now()

  // 2. Optimistic Write to Dexie Outbox
  // We do NOT write to 'messages' table directly.
  // The UI (MessageList) needs to be able to read from Outbox to show pending messages.
  const outboxItem: OutboxItem = {
    projectId,
    conversationId: channelId,
    dedupeId,
    authorId,
    payload: { content, parentMessageId },
    status: 'pending',
    createdAt: now,
  }

  try {
    await db.outbox.add(outboxItem)
  } catch (e) {
    console.error('[SendMessage] Failed to write to outbox:', e)
    // If local write fails, we probably shouldn't send... or maybe we should?
    // Strict safety: Fail.
    return
  }

  // 3. Emit WS Event (Strict Contract)
  // We use the upstream contract to define the shape, ensuring strict compliance.
  const command: SendMessageContract = {
    type: ChatUpstreamEvent.SendMessage,
    payload: {
      conversationId: channelId,
      content,
      dedupeId,
      parentMessageId,
    },
  }

  // WS Manager emits the event + payload.
  // We explicitly use ChatUpstreamEvent.SendMessage which is 'chat:send-message'
  wsManager.emit(ChatUpstreamEvent.SendMessage, command.payload)

  // 4. Note: We do NOT define a timeout here.
  // The 'receive-message' pipeline will handle the ACK (which comes as a 'new-message' event).
  // If the server fails to ack, the message stays in Outbox.
  // A separate 'OutboxRetry' job (later) can handle retries.
}
