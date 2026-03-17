/**
 * DEDUPLICATOR PLUGIN: Filter duplicate/old messages
 *
 * Responsibility: Skip messages already seen based on streamId comparison
 */

import { compareStreamId } from '../utils/stream-id'
import type {
  PluginContext,
  PluginResult,
  ProcessorPlugin,
} from './plugin-types'
import type { BasePayload } from '../core/commit-handler'

export function createDeduplicatorPlugin<
  T extends BasePayload,
>(): ProcessorPlugin<T> {
  return {
    name: 'deduplicator',
    phase: 'pre-process',

    execute(context: PluginContext<T>): Promise<PluginResult> {
      const { state, payload, isReplay } = context

      // IMPORTANT: Skip deduplication for recovery/history batches
      // History messages are OLDER than lastStreamIdSeen by design
      // Only deduplicate realtime messages from WebSocket
      if (isReplay) {
        return Promise.resolve({ action: 'continue' })
      }

      // Check if we've seen this message already
      if (
        state.lastStreamIdSeen &&
        compareStreamId(payload.streamId, state.lastStreamIdSeen) <= 0
      ) {
        return Promise.resolve({
          action: 'skip',
          reason: `Duplicate/old message: ${payload.streamId} (last: ${state.lastStreamIdSeen})`,
        })
      }

      return Promise.resolve({ action: 'continue' })
    },
  }
}
