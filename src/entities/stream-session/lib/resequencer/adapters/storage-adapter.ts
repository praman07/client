/**
 * STORAGE ADAPTER: Domain-specific persistence interface
 */

import type { StreamSessionState } from '../types/state'

/**
 * Cursor state returned by storage adapter
 */
export interface CursorState {
  lastSequence: number
  expectedStreamId: string | null
  epoch: number | null
}

/**
 * Storage adapter interface for domain-specific persistence.
 * Each domain (Chat, Pages, etc.) provides its own implementation.
 */
export interface StorageAdapter<T> {
  commit: (
    state: StreamSessionState<T>,
    payload: T,
    projectId: string,
  ) => Promise<void>
  getCursor: (conversationId: string, projectId: string) => Promise<CursorState>
  reset: (conversationId: string, projectId: string) => Promise<void>
}
