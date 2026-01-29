/**
 * STREAM SESSION STATE: Generic state types
 */

export type ResequencerStatus =
  | 'SYNCED'
  | 'FETCHING'
  | 'RECOVERING'
  | 'DESYNCED'

/**
 * Generic stream session state.
 * @template T - Message payload type
 */
export interface StreamSessionState<T = any> {
  conversationId: string
  projectId: string | null

  // Dual-Sequencing
  lastSequence: number
  expectedStreamId: string | null
  lastStreamIdSeen: string | null

  // Generic buffer - stores ANY message type
  buffer: Map<string, T>

  status: ResequencerStatus
  gapTimer: ReturnType<typeof setTimeout> | null
  lastCommitTs: number
  recoveryAttempts: number

  // Concurrency Lock
  processingChain: Promise<void>
}
