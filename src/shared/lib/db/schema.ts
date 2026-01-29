import Dexie from 'dexie'
import type { EntityTable } from 'dexie'
import type { Message } from '@/entities/message/model/types'

// -- Types --

export interface DBMessage extends Message {
  // We index primarily on [projectId+conversationId+streamId]
  // dedupeId is unique to prevent duplicate delivery
  dedupeId?: string
  sequence?: number // Dual-Sequencing (Optional for back-compat/opt-in)
  projectId: string
}

export interface OutboxItem {
  id?: number // Auto-increment
  projectId: string
  conversationId: string
  dedupeId: string
  authorId: string
  payload: any // Raw payload
  status: 'pending' | 'sending' | 'failed'
  retryCount?: number
  createdAt: number
}

export interface ConversationState {
  projectId: string
  conversationId: string // PK, or part of PK
  lastStreamIdSeen: string | null
  lastSequence?: number // For gap detection
  lastOpenedAt: number
  unreadCount?: number
}

export interface ProjectMeta {
  projectId: string
  workspaceId: string
  lastAccessedAt: number
}

// -- Database Definition --

export class CollabifyDB extends Dexie {
  messages!: EntityTable<DBMessage, 'id'> // PK is technically compound but we can query freely
  outbox!: EntityTable<OutboxItem, 'id'>
  conversation_state!: EntityTable<ConversationState, 'conversationId'> // simplified PK for now, or compound
  project_meta!: EntityTable<ProjectMeta, 'projectId'>

  constructor() {
    super('CollabifyDB')

    this.version(1).stores({
      // 1. Core Message Stream
      // Partitioned by project -> conversation -> streamId
      // Compound Index: [projectId+conversationId+streamId] enables efficient timeline queries
      messages:
        '[projectId+conversationId+streamId], dedupeId, projectId, conversationId, streamId',

      // 2. Outbox (Optimistic Updates)
      // Pending outbound messages
      outbox: '++id, projectId, conversationId, dedupeId, authorId, createdAt',

      // 3. Conversation State
      // Cursor tracking, read receipts, last opened timestamps.
      conversation_state:
        '[projectId+conversationId], projectId, conversationId, lastStreamIdSeen, lastOpenedAt',

      // 4. Project Metadata
      // Track Access Time for LRU Eviction policies.
      project_meta: 'projectId, workspaceId, lastAccessedAt',
    })

    this.version(2).stores({
      outbox:
        '++id, projectId, conversationId, dedupeId, authorId, status, createdAt',
    })

    this.version(3).stores({
      // 5. Dual-Sequencing Support
      // Added `sequence` for gap detection
      // Added `[projectId+conversationId+sequence]` for fast ordering/fetching
      messages:
        '[projectId+conversationId+streamId], [projectId+conversationId+sequence], dedupeId, projectId, conversationId, streamId, sequence',
    })

    this.version(4).stores({
      // 6. Bounded Retries
      outbox:
        '++id, projectId, conversationId, dedupeId, authorId, status, retryCount, createdAt',
    })
  }
}

export const db = new CollabifyDB()
