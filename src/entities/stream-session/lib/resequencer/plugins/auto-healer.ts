/**
 * AUTO-HEALER PLUGIN: Detect and heal server resets
 *
 * Responsibility: Reset state when server restarts (sequence goes back to 1)
 */

import type {
  PluginContext,
  PluginResult,
  ProcessorPlugin,
} from './plugin-types'
import type { BasePayload } from '../core/commit-handler'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('reseq:healer')

export function createAutoHealerPlugin<
  T extends BasePayload,
>(): ProcessorPlugin<T> {
  return {
    name: 'auto-healer',
    phase: 'pre-process',

    async execute(context: PluginContext<T>): Promise<PluginResult> {
      const { state, payload } = context

      // Detect server reset: sequence 1 when we're way ahead
      if (payload.sequence === 1 && state.lastSequence > 1) {
        log.warn(
          `Server reset detected! Local: ${state.lastSequence} -> Remote: 1`,
        )

        // Reset state
        state.lastSequence = 0
        state.lastStreamIdSeen = '0-0'
        state.buffer.clear()
        state.status = 'SYNCED'

        // Clear recovery attempts
        state.recoveryAttempts = 0

        // Clear gap timer if exists
        if (state.gapTimer) {
          clearTimeout(state.gapTimer)
          state.gapTimer = null
        }
      }

      return { action: 'continue' }
    },
  }
}
