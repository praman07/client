/**
 * DEDUPLICATOR PLUGIN: Filter duplicate/old messages
 *
 * Responsibility: Skip messages already seen based on streamId comparison
 */

import type {
  ProcessorPlugin,
  PluginContext,
  PluginResult,
} from './plugin-types'
import type { BasePayload } from '../core/commit-handler'
import { compareStreamId } from '../utils/stream-id'

export function createDeduplicatorPlugin<
  T extends BasePayload,
>(): ProcessorPlugin<T> {
  return {
    name: 'deduplicator',
    phase: 'pre-process',

    async execute(context: PluginContext<T>): Promise<PluginResult> {
      const { state, payload } = context

      // Check if we've seen this message already
      if (
        state.lastStreamIdSeen &&
        compareStreamId(payload.streamId, state.lastStreamIdSeen) <= 0
      ) {
        return {
          action: 'skip',
          reason: `Duplicate/old message: ${payload.streamId} (last: ${state.lastStreamIdSeen})`,
        }
      }

      return { action: 'continue' }
    },
  }
}
