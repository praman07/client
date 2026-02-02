/**
 * CURSOR LOADER: Cursor fetching and validation utility
 *
 * Responsibility: Load and validate cursor state from storage
 */

import { safeParseStreamId } from '../utils/stream-id'
import type { CursorState, StorageAdapter } from '../adapters/storage-adapter'

export interface CursorLoader {
  load: (conversationId: string, projectId?: string) => Promise<LoadedCursor>
}

export interface LoadedCursor {
  lastSequence: number
  expectedStreamId: string
  isValid: boolean
}

export function createCursorLoader<T>(
  storageAdapter: StorageAdapter<T>,
): CursorLoader {
  /**
   * Load cursor from storage with validation
   */
  async function load(
    conversationId: string,
    projectId?: string,
  ): Promise<LoadedCursor> {
    try {
      const cursor: CursorState = await storageAdapter.getCursor(
        conversationId,
        projectId || '',
      )

      // Validate stream ID
      const validStreamId = safeParseStreamId(cursor.expectedStreamId)

      if (cursor.expectedStreamId && !validStreamId) {
        console.error(
          `[CursorLoader] Corrupted StreamID: ${cursor.expectedStreamId}. Resetting.`,
        )

        return {
          lastSequence: cursor.lastSequence || 0,
          expectedStreamId: '0-0',
          isValid: false,
        }
      }

      // Return validated cursor
      return {
        lastSequence: cursor.lastSequence || 0,
        expectedStreamId: validStreamId || '0-0',
        isValid: true,
      }
    } catch (e) {
      console.error('[CursorLoader] Failed to load cursor:', e)

      return {
        lastSequence: 0,
        expectedStreamId: '0-0',
        isValid: false,
      }
    }
  }

  return { load }
}
