/**
 * HIERARCHICAL DEBUG FLAGS
 *
 * Resolution Priority: FILE > GROUP > ALL
 * - Set to `true` to enable logging
 * - Set to `undefined` to inherit from parent
 *
 * @example
 * // Enable just one file
 * FILES['chat:scroll'] = true
 *
 * // Enable entire chat feature
 * GROUPS.chat = true
 *
 * // Enable everything
 * ALL = true
 */

// ═══════════════════════════════════════════════════════════════
// MASTER SWITCH
// ═══════════════════════════════════════════════════════════════
export const ALL = false

// ═══════════════════════════════════════════════════════════════
// GROUP FLAGS (enable entire feature/module)
// ═══════════════════════════════════════════════════════════════
export const GROUPS = {
  // Features
  chat: false,
  auth: false,
  whiteboard: false, // ❌ Disabled - use file-level flags for state sync testing
  'whiteboard-sync': false, // ❌ Disabled - use file-level flags

  // Modules
  websocket: false,
  resequencer: false,

  // Infrastructure
  db: false,
  api: false,
} as const

// ═══════════════════════════════════════════════════════════════
// FILE FLAGS (granular per-file control)
// ═══════════════════════════════════════════════════════════════
export const FILES: Record<string, boolean | undefined> = {
  // ─────────────────────────────────────
  // Chat Feature
  // ─────────────────────────────────────
  'chat:scroll': false,
  'chat:history': false,
  'chat:storage': false,
  'chat:window': false,
  'chat:messageList': false,
  'chat:memberCache': false,
  'chat:message': false,
  'chat:authors': false,
  'chat:sidebar': false,
  'chat:outbox': false,
  'chat:ack': false,
  'chat:handler': false,
  'chat:sync-required-handler': false,

  // ─────────────────────────────────────
  // WebSocket Module
  // ─────────────────────────────────────
  'ws:connection': false,
  'ws:registry': false,
  'ws:plugin': false,
  'ws:bridge': false,
  'ws:orchestrator': false,
  'ws:manager': false,
  'ws:bus': false,
  'ws:router': false,
  'ws:conn-mgr': false,
  'ws:reconnect': false,
  'ws:queue': false,
  'ws:leader': false,
  'ws:sub-mgr': false,
  'ws:sub-rec': false,
  'ws:plugin-registry': false,

  // ─────────────────────────────────────
  // Resequencer Module
  // ─────────────────────────────────────
  'reseq:processor': false,
  'reseq:dedup': false,
  'reseq:factory': false,
  'reseq:state': false,
  'reseq:storage': false,
  'reseq:commit': false,
  'reseq:buffer': false,
  'reseq:gap': false,
  'reseq:healer': false,
  'reseq:cursor': false,

  // ─────────────────────────────────────
  // Chat Recovery & Features
  // ─────────────────────────────────────
  'chat:recovery': false,
  'chat:sync': false,
  'app:events': false,
  'app:onboarding': false,
  'app:workspace': false,

  // ─────────────────────────────────────
  // Whiteboard Feature
  // ─────────────────────────────────────
  'whiteboard:presence': false,
  'whiteboard:sidebar': false,
  'whiteboard:events': false,
  'whiteboard:user-joined': false,
  'whiteboard:subscribe': false,
  'whiteboard:plugin': false,
  'whiteboard:ydoc': false,
  'whiteboard:validation': false,
  'whiteboard:ydoc-instance': false,
  'whiteboard:ydoc-registry': false, // NEW: ydoc-registry.ts

  // ─────────────────────────────────────
  // Whiteboard Board Update Flow
  // ─────────────────────────────────────
  'whiteboard:board-update': false,
  'whiteboard:send-update': false,
  'whiteboard:update-ack': false,
  'whiteboard:board-locked': false,
  'whiteboard:board-unlocked': false,
  'whiteboard:user-left': false,
  'whiteboard:use-subscribe': false,
  'whiteboard:use-send-update': false,
  'whiteboard:unsubscribe': false,
  'whiteboard:cache': false, // Disabled for testing
  'whiteboard:cache-hook': false, // Disabled for testing
  'whiteboard:offline-queue': false, // Disabled for testing
  'whiteboard:sync-engine': false,
  'whiteboard:canvas-lifecycle': false,
  'whiteboard:conflict-resolver': false,
  'whiteboard:pending-tracker': false, // NEW: pending-updates-tracker.ts

  // ─────────────────────────────────────
  // ✅ STATE SYNC TESTING (ENABLED)
  // ─────────────────────────────────────
  'whiteboard:canvas': false, // Main canvas component
  'whiteboard:collab-v2': false, // NEW: use-collab-v2.ts - Y.Doc initialization
  'whiteboard:state-vector-sync': false, // NEW: use-state-vector-sync.ts - GraphQL diff sync
  'whiteboard:network-sync': false, // WebSocket real-time sync
  'whiteboard:init-state': false, // NEW: use-board-initialization.ts - Board initialization

  // ─────────────────────────────────────
  // Additional Whiteboard
  // ─────────────────────────────────────
  'whiteboard:flush-queue': false,
  'whiteboard:sync': false,

  // ─────────────────────────────────────
  // Database/Storage
  // ─────────────────────────────────────
  'db:messages': false,
  'db:outbox': false,
  'db:gc': false,
}

export type GroupFlag = keyof typeof GROUPS
export type FileFlag = keyof typeof FILES
