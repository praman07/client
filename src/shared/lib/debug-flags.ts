/**
 * HIERARCHICAL DEBUG FLAGS (Client)
 *
 * Resolution Priority: FILE > GROUP > ALL
 * - true      → always enabled
 * - false     → always disabled
 * - undefined → inherit from parent group / ALL
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
export const ALL = true

// ═══════════════════════════════════════════════════════════════
// GROUP FLAGS (enable entire feature/module)
// ═══════════════════════════════════════════════════════════════
export const GROUPS = {
  // ─── Feature groups ──────────────────────────────────────────
  chat: true,
  auth: false,
  whiteboard: false,
  'whiteboard-sync': false,
  thumbnail: false,
  vault: false,         // all vault feature logs
  pages: true,          // ✅ all pages feature logs
  issues: false,        // all issues feature logs

  // ─── Module groups ────────────────────────────────────────────
  ws: true,            // all ws:* logs (alias: websocket below)
  websocket: true,     // legacy alias — use 'ws' group flag instead
  resequencer: false,   // all reseq:* logs
  shared: false,        // all shared:* utility logs
  yjs: false,           // all yjs:* logs

  // ─── Infrastructure ───────────────────────────────────────────
  db: false,
  api: false,
} as const

// ═══════════════════════════════════════════════════════════════
// FILE FLAGS (granular per-file control, highest priority)
// ═══════════════════════════════════════════════════════════════
export const FILES: Record<string, boolean | undefined> = {
  // ─────────────────────────────────────────────────────────────
  // App Layer
  // ─────────────────────────────────────────────────────────────
  'app:events': false,
  'app:onboarding': false,
  'app:workspace': false,
  'ws:notification-plugin': false,
  'ws:auth-plugin': false,

  // ─────────────────────────────────────────────────────────────
  // WebSocket Module
  // ─────────────────────────────────────────────────────────────
  'ws:connection': false,
  'ws:conn-mgr': false,
  'ws:registry': false,
  'ws:plugin': true,           // ✅ chat/whiteboard/pages plugin lifecycle (createDomainPlugin)
  'ws:plugin-registry': true,  // ✅ registerPlugin / unregisterPlugin calls
  'ws:domain-registry': false,
  'ws:orchestrator': false,
  'ws:manager': false,
  'ws:bus': false,
  'ws:router': false,
  'ws:reconnect': false,
  'ws:queue': false,
  'ws:leader': false,
  'ws:sub-mgr': false,
  'ws:sub-rec': false,
  'ws:pages-plugin': true,       // ✅ pages-plugin.ts lifecycle
  'ws:whiteboard-plugin': true,  // ✅ whiteboard-plugin.ts lifecycle

  // ─────────────────────────────────────────────────────────────
  // Resequencer Module
  // ─────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────
  // Database / Storage
  // ─────────────────────────────────────────────────────────────
  'db:gc': false,
  'db:messages': false,
  'db:outbox': false,

  // ─────────────────────────────────────────────────────────────
  // YJS
  // ─────────────────────────────────────────────────────────────
  'yjs:pending-updates-tracker': false,

  // ─────────────────────────────────────────────────────────────
  // Chat Feature
  // ─────────────────────────────────────────────────────────────
  'chat:scroll': false,
  'chat:history': false,
  'chat:window': false,
  'chat:messageList': false,
  'chat:memberCache': false,
  'chat:message': false,
  'chat:sidebar': false,
  'chat:outbox': false,
  'chat:ack': false,
  // WS event handlers
  'chat:handler': true,                  // ✅ send-message handler
  'chat:edit-handler': true,             // ✅ edit-message handler
  'chat:delete-handler': true,           // ✅ delete-message handler
  'chat:reaction-handler': true,         // ✅ reaction handler
  'chat:sync-required-handler': true,    // ✅ sync-required handler
  // Recovery / sync
  'chat:recovery': false,
  'chat:sync': false,

  // ─────────────────────────────────────────────────────────────
  // Thumbnail Pipeline
  // ─────────────────────────────────────────────────────────────
  'thumbnail:read-elements': false,
  'thumbnail:hook': false,

  // ─────────────────────────────────────────────────────────────
  // Whiteboard Feature
  // ─────────────────────────────────────────────────────────────
  // Core
  'whiteboard:canvas': false,
  'whiteboard:presence': false,
  'whiteboard:sidebar': false,
  'whiteboard:validation': false,
  'whiteboard:ydoc-registry': false,
  // WS events
  'whiteboard:subscribe': true,          // ✅
  'whiteboard:unsubscribe': true,        // ✅
  'whiteboard:board-update': true,       // ✅
  'whiteboard:send-update': false,
  'whiteboard:update-ack': true,         // ✅
  'whiteboard:use-send-update': false,
  'whiteboard:user-joined': true,        // ✅
  'whiteboard:user-left': true,          // ✅
  // Board lifecycle
  'whiteboard:board-locked': false,
  'whiteboard:board-unlocked': false,
  'whiteboard:board-deleted': true,        // ✅ board-deleted.ts WS handler
  'whiteboard:delete-board-hook': true,    // ✅ use-delete-board.ts
  // Sync subsystem
  'whiteboard:sync': false,
  'whiteboard:sync:binding': false,
  'whiteboard:sync:client-diff': false,
  'whiteboard:sync:indexeddb': false,
  'whiteboard:sync:server': false,
  'whiteboard:network-sync': false,
  'whiteboard:offline-queue': false,
  'whiteboard:indexeddb-cleanup': true,    // ✅ clean-board-indexeddb.ts
  // Misc
  'whiteboard:flush-queue': false,
  'whiteboard:collab-v2': false,
  'whiteboard:state-vector-sync': false,
  'whiteboard:init-state': false,
  // Media lifecycle
  'whiteboard:media:vault-upload': true,    // generateIdForFile S3 pipeline
  'whiteboard:media:lifecycle': true,       // yElements observer + markFilesUnreferenced


  // ─────────────────────────────────────────────────────────────
  // Pages Feature
  // ─────────────────────────────────────────────────────────────
  // Sync orchestrator
  'pages:use-page-sync': true,
  'pages:page-editor': true,
  'pages:page-cover': true,
  'pages:page-title': true,
  // Sync phases
  'pages:phase1:server-sync': true,
  'pages:phase2:indexeddb-sync': true,
  'pages:phase3:client-diff': true,
  'pages:phase4:network-sync': true,
  // WS event handlers
  'pages:subscribe': true,
  'pages:subscribe-success': true,
  'pages:unsubscribe': true,
  'pages:page-update': true,
  'pages:update-ack': true,
  'pages:awareness-update': true,
  'pages:user-joined': true,
  'pages:user-left': true,
  'pages:validation': true,
  // Entities
  'pages:ydoc-registry': true,
  'pages:awareness-provider': true,
  'pages:offline-queue': true,
  'pages:indexeddb-cleanup': true,
  // Send
  'pages:send-page-update': true,
  // Presence
  'pages:presence': true,
  // Mutation hooks (enable individually as needed)
  'pages:add-page-collaborators-hook': false,
  'pages:archive-page-hook': false,
  'pages:delete-page-hook': false,
  'pages:lock-page-hook': false,
  'pages:remove-page-collaborator-hook': false,
  'pages:rename-page-hook': false,
  'pages:reorder-page-hook': false,
  'pages:unarchive-page-hook': false,
  'pages:unlock-page-hook': false,
  'pages:update-page-details-hook': false,

  // ─────────────────────────────────────────────────────────────
  // Issues Feature
  // ─────────────────────────────────────────────────────────────
  'issues:edit-issue-description-editor': false,  // edit-issue-description-editor.tsx

  // ─────────────────────────────────────────────────────────────
  // Vault Feature
  // ─────────────────────────────────────────────────────────────
  // Upload pipeline
  'vault:upload': true,           // use-upload-file.ts
  'vault:upload:s3': true,        // upload-to-s3.ts
  'vault:upload:validate': true,  // validate-file.ts

  // ─────────────────────────────────────────────────────────────
  // Shared Utilities
  // ─────────────────────────────────────────────────────────────
  // BlockNote integration
  'shared:blocknote:upload-adapter': false,  // blocknote-upload-adapter.ts
  'shared:blocknote:url-refresher': false,   // blocknote-url-refresher.ts
  'shared:blocknote:file-utils': false,      // blocknote-file-utils.ts
}

export type GroupFlag = keyof typeof GROUPS
export type FileFlag = keyof typeof FILES
