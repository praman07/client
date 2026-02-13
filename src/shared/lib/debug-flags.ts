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
  whiteboard: true, // ✅ General whiteboard (presence, subscribe, events)
  'whiteboard-sync': true, // ✅ Board-update E2E flow tracing

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
  'chat:scroll': undefined, // use-chat-scroll.ts
  'chat:history': undefined, // use-history-loader.ts
  'chat:storage': undefined, // storage.ts
  'chat:window': undefined, // chat-window.tsx
  'chat:messageList': undefined, // message-list.tsx
  'chat:memberCache': undefined, // member-cache-context.tsx
  'chat:message': undefined, // primary-message.tsx
  'chat:authors': undefined, // use-message-authors.ts
  'chat:sidebar': undefined, // chat-sidebar.tsx
  'chat:outbox': undefined, // outbox-worker.ts
  'chat:ack': undefined, // ack-message-handler.ts
  'chat:handler': undefined, // new-message-handler.ts

  // ─────────────────────────────────────
  // WebSocket Module
  // ─────────────────────────────────────
  'ws:connection': undefined, // socket-connection.provider.ts
  'ws:registry': undefined, // registry.tsx
  'ws:plugin': undefined, // chat-plugin.ts
  'ws:bridge': undefined, // event-bridge.ts
  'ws:orchestrator': undefined, // socket-orchestrator.ts
  'ws:manager': undefined, // manager.ts
  'ws:bus': undefined, // event-bus.ts
  'ws:router': undefined, // event-router.ts
  'ws:conn-mgr': undefined, // core/connection-manager.ts
  'ws:reconnect': undefined, // core/reconnection-strategy.ts
  'ws:queue': undefined, // core/message-queue.ts
  'ws:leader': undefined, // core/leader-integration.ts
  'ws:sub-mgr': undefined, // subscriptions/subscription-manager.ts
  'ws:sub-rec': undefined, // subscriptions/subscription-recovery.ts

  // ─────────────────────────────────────
  // Resequencer Module
  // ─────────────────────────────────────
  'reseq:processor': undefined, // message-processor.ts
  'reseq:dedup': undefined, // deduplicator.ts
  'reseq:factory': undefined, // create-resequencer.ts
  'reseq:state': undefined, // state-manager.ts
  'reseq:storage': undefined, // storage.ts (chat-session)
  'reseq:commit': undefined, // core/commit-handler.ts
  'reseq:buffer': undefined, // core/buffer-manager.ts
  'reseq:gap': undefined, // plugins/gap-detector.ts
  'reseq:healer': undefined, // plugins/auto-healer.ts
  'reseq:cursor': undefined, // utils/cursor-loader.ts

  // ─────────────────────────────────────
  // Chat Recovery & Features
  // ─────────────────────────────────────
  'chat:recovery': undefined, // recovery-listener.tsx & use-fetch-delta.ts
  'chat:sync': undefined, // sync-required-handler.ts
  'app:events': undefined, // app/providers/events/index.tsx
  'app:onboarding': undefined, // use-onboarding-orchestrator.ts
  'app:workspace': undefined, // workspace-slug-field.tsx

  // ─────────────────────────────────────
  // Whiteboard Feature
  // ─────────────────────────────────────
  'whiteboard:presence': undefined, // entities/whiteboard-presence/model/slice.ts
  'whiteboard:sidebar': undefined, // widgets/collaboration-sidebar
  'whiteboard:events': undefined, // features/whiteboard/events
  'whiteboard:user-joined': undefined, // events/handlers/user-joined.ts
  'whiteboard:subscribe': undefined, // events/handlers/subscribe-success.ts
  'whiteboard:plugin': undefined, // providers/ws-domains/whiteboard-plugin.ts
  'whiteboard:ydoc': undefined, // entities/whiteboard-session/lib/ydoc-manager.ts
  'whiteboard:validation': undefined, // entities/whiteboard-session/lib/validation.ts
  'whiteboard:ydoc-instance': undefined, // entities/whiteboard-session/hooks/use-ydoc-instance.ts

  // Board-update E2E flow (inherits from GROUPS['whiteboard-sync'])
  'whiteboard:canvas': undefined, // widgets/whiteboard-canvas/hooks/use-excalidraw-binding.ts
  'whiteboard:board-update': undefined, // features/whiteboard/events/handlers/board-update.ts
  'whiteboard:send-update': undefined, // features/whiteboard/send-board-update

  // ─────────────────────────────────────
  // Database/Storage
  // ─────────────────────────────────────
  'db:messages': undefined,
  'db:outbox': undefined,
  'db:gc': undefined, // storage-gc/index.ts
}

export type GroupFlag = keyof typeof GROUPS
export type FileFlag = keyof typeof FILES
