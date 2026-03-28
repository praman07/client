import Dexie from 'dexie'
import type { EntityTable } from 'dexie'
import type { Message } from '@/shared/contracts/chat/message'

// ============================================================================
// CHAT DOMAIN
// ============================================================================

/**
 * Message storage with dual-sequencing support
 *
 * Architecture Decision: Why dual indexes (streamId + sequence)?
 * - streamId: Redis Stream ordering (durable, cross-client)
 * - sequence: Gap detection for real-time reconciliation
 * Both are needed because Redis doesn't guarantee monotonic delivery order
 */
export interface DBMessage extends Message {
  dedupeId?: string
  sequence?: number
  projectId: string
}

/**
 * Optimistic update queue with bounded retries
 *
 * Architecture Decision: Why unknown payload?
 * Prevents accidental type coercion. Force explicit casting at write/read sites.
 */
export interface OutboxItem {
  id?: number
  projectId: string
  conversationId: string
  dedupeId: string
  authorId: string
  payload: {
    content: string
    parentMessageId?: string
    [key: string]: unknown
  }
  status: 'pending' | 'sending' | 'failed'
  retryCount?: number
  createdAt: number
}

/**
 * Conversation read cursors and metadata
 * Enables unread count calculation without full message scan
 */
export interface ConversationState {
  projectId: string
  conversationId: string
  lastStreamIdSeen: string | null
  lastSequence?: number
  lastOpenedAt: number
  unreadCount?: number
}

/**
 * Project metadata for LRU cache eviction
 */
export interface ProjectMeta {
  projectId: string
  workspaceId: string
  lastAccessedAt: number
}

// ============================================================================
// WHITEBOARD DOMAIN
// ============================================================================

/**
 * Offline queue for Y.js CRDT updates
 *
 * Architecture Decision: Binary storage (Uint8Array) not Base64
 * - Saves ~33% storage overhead
 * - Avoids encode/decode CPU cost on every read/write
 *
 * Architecture Decision: Why track size?
 * - IndexedDB has browser-specific quota limits (~50MB-1GB)
 * - Size enables proactive queue compaction before hitting quota
 * - Size-aware merge heuristics (merge small updates, split large ones)
 *
 * TODO (Architecture): Implement quota pressure detection
 * - Monitor `navigator.storage.estimate()` periodically
 * - Trigger aggressive merging when quota > 80%
 */
export interface WhiteboardOfflineUpdate {
  id?: number
  boardId: string
  update: Uint8Array
  size: number
  dedupeId: string
  timestamp: number
  status: 'pending' | 'sending' | 'failed'
  retryCount: number
  lastRetryAt: number | null
  createdAt: number
  mergedInto?: string
  error?: string
}

/**
 * Y.Doc snapshot cache with size-based LRU eviction
 *
 * Architecture Decision: Why both stateVector + snapshot?
 * - stateVector: Enables delta sync (only fetch missing updates)
 * - snapshot: Full state for cold start (avoids replaying entire history)
 * Trade-off: 2x storage for significantly faster reconnection
 *
 * TODO (Architecture): Implement smart eviction policy
 * - Current: LRU by time only
 * - Better: Weighted score (recency + frequency + size)
 * - Example: Keep small frequently-accessed boards, evict large stale ones
 */
export interface WhiteboardBoardCache {
  boardId: string
  stateVector: Uint8Array
  snapshot: Uint8Array
  snapshotSize: number
  streamId: string
  updatedAt: number
}

/**
 * Board thumbnail cache
 *
 * Architecture Decision: WebP binary (Uint8Array) not data URL
 * - ~5-15KB per thumbnail vs ~50-200KB PNG
 * - No Base64 overhead — same binary pattern as WhiteboardOfflineUpdate
 * - Displayed via URL.createObjectURL, revoked on unmount
 *
 * contentHash: djb2 over element id+version pairs — skip regeneration if unchanged
 */
export interface WhiteboardThumbnail {
  boardId: string
  thumbnail: Uint8Array
  contentHash: number
  generatedAt: number
  sizeBytes: number
}

// ============================================================================
// PAGES DOMAIN
// ============================================================================

/**
 * Offline queue for Y.js CRDT updates (Pages)
 *
 * Mirrors WhiteboardOfflineUpdate but keyed by pageId.
 * Binary storage (Uint8Array) — same rationale as whiteboard.
 */
export interface PageOfflineUpdate {
  id?: number
  pageId: string
  update: Uint8Array
  size: number
  dedupeId: string
  timestamp: number
  status: 'pending' | 'sending' | 'failed'
  retryCount: number
  lastRetryAt: number | null
  createdAt: number
  mergedInto?: string
  error?: string
}

// ============================================================================
// DATABASE SCHEMA
// ============================================================================

export class CollabifyDB extends Dexie {
  // Chat tables
  messages!: EntityTable<DBMessage, 'id'>
  outbox!: EntityTable<OutboxItem, 'id'>
  conversation_state!: EntityTable<ConversationState, 'conversationId'>
  project_meta!: EntityTable<ProjectMeta, 'projectId'>

  // Whiteboard tables
  whiteboardOfflineUpdates!: EntityTable<WhiteboardOfflineUpdate, 'id'>
  whiteboardBoardCache!: EntityTable<WhiteboardBoardCache, 'boardId'>
  whiteboardThumbnails!: EntityTable<WhiteboardThumbnail, 'boardId'>

  // Pages tables
  pageOfflineUpdates!: EntityTable<PageOfflineUpdate, 'id'>

  constructor() {
    super('CollabifyDB')

    // v1: Initial chat schema
    this.version(1).stores({
      messages:
        '[projectId+conversationId+streamId], dedupeId, projectId, conversationId, streamId',
      outbox: '++id, projectId, conversationId, dedupeId, authorId, createdAt',
      conversation_state:
        '[projectId+conversationId], projectId, conversationId, lastStreamIdSeen, lastOpenedAt',
      project_meta: 'projectId, workspaceId, lastAccessedAt',
    })

    // v2: Outbox status index (enables efficient retry sweeps)
    this.version(2).stores({
      outbox:
        '++id, projectId, conversationId, dedupeId, authorId, status, createdAt',
    })

    // v3: Dual-sequencing (gap detection for real-time reconciliation)
    this.version(3).stores({
      messages:
        '[projectId+conversationId+streamId], [projectId+conversationId+sequence], dedupeId, projectId, conversationId, streamId, sequence',
    })

    // v4: Bounded retries (prevent infinite retry loops)
    this.version(4).stores({
      outbox:
        '++id, [conversationId+projectId], projectId, conversationId, dedupeId, authorId, status, retryCount, createdAt',
    })

    // v5: Whiteboard offline-first support
    // WARNING: Binary blob storage - monitor IndexedDB quota pressure
    // TODO: Add quota monitoring in app bootstrap
    this.version(5).stores({
      whiteboardOfflineUpdates:
        '++id, boardId, status, dedupeId, mergedInto, [boardId+status], timestamp, createdAt, size',

      whiteboardBoardCache: 'boardId, updatedAt, snapshotSize',
    })

    // v6: Board thumbnail cache (WebP binary, change-detected via content hash)
    this.version(6).stores({
      whiteboardThumbnails: 'boardId, generatedAt, sizeBytes',
    })

      // v7: Pages offline queue (same binary blob pattern as whiteboard)
    this.version(7).stores({
      pageOfflineUpdates:
        '++id, pageId, status, dedupeId, mergedInto, [pageId+status], timestamp, createdAt, size',
    })

    // v8: Message ID index for O(1) parentMessageId lookup (inline reply resolution)
    // The messages store PK is compound [projectId+conversationId+streamId];
    // this adds a standalone secondary index on the server-assigned UUID so
    // db.messages.where('id').equals(uuid) resolves parent messages correctly.
    this.version(8).stores({
      messages:
        '[projectId+conversationId+streamId], [projectId+conversationId+sequence], id, dedupeId, projectId, conversationId, streamId, sequence',
    })
  }
}

export const db = new CollabifyDB()
