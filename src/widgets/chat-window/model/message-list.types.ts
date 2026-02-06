import type { DeliveryStatus, Message } from '@/shared/contracts/chat/message'

/**
 * The unified shape used by the MessageList Virtualizer.
 * Merges committed DB messages with optimistic Outbox items.
 */
export interface MessageRowData extends Omit<Message, 'deliveryStatus'> {
  // Overwrite specifics
  deliveryStatus: DeliveryStatus

  // UI Specifics
  isOptimistic: boolean
  isGapFiller?: boolean // Visual placeholder for missing sequences

  // Virtualization Keys
  virtualId: string // dedupeId || streamId
  projectId: string
  sequence?: number
}

export type MessageListScrollMode =
  | 'LOCKED_BOTTOM' // Auto-scroll to bottom on new message
  | 'FREE_SCROLL' // User is browsing history
  | 'PREPENDING' // Loading older history, anchor preservation needed
  | 'RECOVERING' // Gap recovery in progress, freeze auto-scroll
