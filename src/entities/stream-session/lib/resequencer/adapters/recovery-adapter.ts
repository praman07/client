/**
 * RECOVERY ADAPTER: Domain-specific recovery interface
 */

/**
 * Recovery request information
 */
export interface RecoveryRequest {
  conversationId: string
  projectId: string | null
  lastSequence: number
  lastStreamId: string | null
  gapSize: number
  attempt: number
}

/**
 * Recovery adapter interface for triggering domain-specific recovery.
 * Each domain implements its own recovery fetch logic.
 */
export interface RecoveryAdapter {
  /**
   * Trigger recovery for a conversation.
   * The domain's feature layer handles fetching missing messages.
   */
  triggerRecovery: (request: RecoveryRequest) => void
}
