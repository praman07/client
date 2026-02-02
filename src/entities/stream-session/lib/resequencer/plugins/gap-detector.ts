/**
 * GAP DETECTOR PLUGIN: Detect sequence gaps and trigger recovery
 *
 * Responsibility: Monitor for missing messages and coordinate recovery
 */

import {
  FAST_FORWARD_THRESHOLD,
  GAP_TIMEOUT_MS,
  MAX_RECOVERY_ATTEMPTS,
  RECOVERY_TIMEOUT_MS,
} from '../utils/constants'
import type {
  PluginContext,
  PluginResult,
  ProcessorPlugin,
} from './plugin-types'
import type { BasePayload } from '../core/commit-handler'
import type { RecoveryAdapter } from '../adapters/recovery-adapter'
import type { BufferManager } from '../core/buffer-manager'

export interface GapDetectorConfig {
  gapTimeoutMs?: number
  fastForwardThreshold?: number
  maxRecoveryAttempts?: number
  recoveryTimeoutMs?: number
}

export function createGapDetectorPlugin<T extends BasePayload>(
  recoveryAdapter: RecoveryAdapter,
  bufferManager: BufferManager<T>,
  config?: GapDetectorConfig,
): ProcessorPlugin<T> {
  const gapTimeout = config?.gapTimeoutMs ?? GAP_TIMEOUT_MS
  const fastForwardThreshold =
    config?.fastForwardThreshold ?? FAST_FORWARD_THRESHOLD
  const maxRecoveryAttempts =
    config?.maxRecoveryAttempts ?? MAX_RECOVERY_ATTEMPTS
  const recoveryTimeout = config?.recoveryTimeoutMs ?? RECOVERY_TIMEOUT_MS

  /**
   * Handle gap timeout
   */
  async function onGapTimeout(context: PluginContext<T>): Promise<void> {
    const { state, projectId } = context

    state.gapTimer = null

    if (state.buffer.size === 0) return

    // Fast-forward for large gaps
    const oldest = bufferManager.findOldest(state.buffer)
    if (oldest) {
      const gapSize = oldest.sequence - state.lastSequence - 1

      if (gapSize > fastForwardThreshold) {
        console.warn(`[GapDetector] Large gap (${gapSize}). Fast-forwarding.`)
        await bufferManager.flush(state, projectId, 'force')
        state.status = 'SYNCED'
        state.recoveryAttempts = 0
        return
      }
    }

    // Trigger recovery if under max attempts
    if (state.recoveryAttempts < maxRecoveryAttempts) {
      console.warn(
        `[GapDetector] Triggering recovery (${state.recoveryAttempts + 1}/${maxRecoveryAttempts})`,
      )

      state.status = 'RECOVERING'

      recoveryAdapter.triggerRecovery({
        conversationId: state.conversationId,
        projectId: state.projectId,
        lastSequence: state.lastSequence,
        lastStreamId: state.expectedStreamId,
        gapSize: oldest ? oldest.sequence - state.lastSequence - 1 : 0,
        attempt: state.recoveryAttempts + 1,
      })

      state.recoveryAttempts++

      // Re-schedule timeout
      state.gapTimer = setTimeout(() => {
        onGapTimeout(context)
      }, recoveryTimeout)
    } else {
      // Max attempts exhausted - force flush
      console.error('[GapDetector] Max recovery attempts. Force flushing.')
      await bufferManager.flush(state, projectId, 'force')
    }
  }

  return {
    name: 'gap-detector',
    phase: 'post-process',

    async execute(context: PluginContext<T>): Promise<PluginResult> {
      const { state, payload, isReplay } = context

      // Don't set gap timer for replay messages
      if (isReplay) {
        return { action: 'continue' }
      }

      // Check if buffered (gap detected)
      const isBuffered = state.buffer.has(payload.streamId)

      if (isBuffered && !state.gapTimer) {
        // Start gap timer
        state.gapTimer = setTimeout(() => {
          onGapTimeout(context)
        }, gapTimeout)
      }

      return { action: 'continue' }
    },
  }
}
