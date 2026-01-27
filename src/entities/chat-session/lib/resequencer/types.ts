import type { NewMessagePayload } from '@/shared/ws/protocol'

export type ResequencerStatus = 'SYNCED' | 'RECOVERING' | 'DESYNCED'

export interface ConversationState {
  conversationId: string
  expectedStreamId: string | null
  // We use string Keys to strictly map ID -> Payload
  buffer: Map<string, NewMessagePayload>
  status: ResequencerStatus
  gapTimer: ReturnType<typeof setTimeout> | null
  lastCommitTs: number
  recoveryAttempts: number
  // Concurrency Lock: Chain promises to ensure sequential execution per conversation
  processingChain: Promise<void>
}
