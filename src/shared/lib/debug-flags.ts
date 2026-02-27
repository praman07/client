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
  whiteboard: false,
  'whiteboard-sync': false,
  thumbnail: false,
  pages: true, // ✅ All pages feature logs

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
  'whiteboard:board-deleted': true, // ✅ board-deleted.ts WS handler
  'whiteboard:indexeddb-cleanup': true, // ✅ clean-board-indexeddb.ts
  'whiteboard:delete-board-hook': true, // ✅ use-delete-board.ts mutation hook
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

  // ─────────────────────────────────────
  // Thumbnail Pipeline
  // ─────────────────────────────────────
  'thumbnail:read-elements': false, // read-board-elements.ts
  'thumbnail:hook': false, // use-board-thumbnail.ts

  // ─────────────────────────────────────
  // Pages Feature ✅ ENABLED
  // Widget: page-editor sync phases
  // ─────────────────────────────────────
  // Sync orchestrator
  'pages:use-page-sync': true, // hooks/use-page-sync.ts
  'pages:page-editor': true, // widgets/page-editor/ui/page-editor.tsx (render + editor mount)
  // Phase hooks
  'pages:phase1:server-sync': true, // hooks/sync-phases/use-server-sync.ts
  'pages:phase2:indexeddb-sync': true, // hooks/sync-phases/use-indexeddb-sync.ts
  'pages:phase3:client-diff': true, // hooks/sync-phases/use-client-diff.ts
  'pages:phase4:network-sync': true, // hooks/sync-phases/use-network-sync.ts
  // WS event handlers (features/pages/events/lib/handlers)
  'pages:subscribe': true, // handlers/subscribe.ts
  'pages:subscribe-success': true, // handlers/subscribe-success.ts
  'pages:unsubscribe': true, // handlers/unsubscribe.ts
  'pages:page-update': true, // handlers/page-update.ts
  'pages:update-ack': true, // handlers/update-ack.ts
  'pages:awareness-update': true, // handlers/awareness-update.ts
  'pages:user-joined': true, // handlers/user-joined.ts
  'pages:user-left': true, // handlers/user-left.ts
  'pages:validation': true, // entities/page-session/lib/validation.ts
  // Entities
  'pages:ydoc-registry': true, // entities/page-session/lib/yjs/ydoc-registry.ts
  'pages:awareness-provider': true, // entities/page-session/lib/yjs/page-awareness-provider.ts
  'pages:pending-updates-tracker': true, // entities/page-session/lib/pending-updates-tracker.ts
  'pages:offline-queue': true, // entities/page-session/lib/offline-queue-manager.ts
  'pages:indexeddb-cleanup': true, // features/pages/clean-page-indexeddb/
  // Send
  'pages:send-page-update': true, // features/pages/send-page-update/
  // UI
  'pages:page-title': true, // widgets/page-editor/ui/page-title.tsx
  // Presence
  'pages:presence': true, // entities/page-presence/
  // Mutation hooks (less critical — enable individually if needed)
  'pages:add-page-collaborators-hook': false,
  'pages:archive-page-hook': false,
  'pages:delete-page-hook': false,
  'pages:lock-page-hook': false,
  'pages:remove-page-collaborator-hook': false,
  'pages:rename-page-hook': false,
  'pages:reorder-page-hook': false,
  'pages:unarchive-page-hook': false,
  'pages:unlock-page-hook': false,
}

export type GroupFlag = keyof typeof GROUPS
export type FileFlag = keyof typeof FILES
