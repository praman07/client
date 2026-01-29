import type { NewMessagePayload } from '@/shared/ws/protocol'

export type ResequencerStatus =
  | 'SYNCED'
  | 'FETCHING'
  | 'RECOVERING'
  | 'DESYNCED'

export interface ConversationState {
  conversationId: string
  projectId: string | null
  // Dual-Sequencing:
  lastSequence: number // Monotonic Counter (Truth)
  expectedStreamId: string | null // Legacy / Tie-breaker
  lastStreamIdSeen: string | null // Deduplication Truth (Hybrid)
  // We use string Keys to strictly map ID -> Payload
  buffer: Map<string, NewMessagePayload>
  status: ResequencerStatus
  gapTimer: ReturnType<typeof setTimeout> | null
  lastCommitTs: number
  recoveryAttempts: number
  // Concurrency Lock: Chain promises to ensure sequential execution per conversation
  processingChain: Promise<void>
}
