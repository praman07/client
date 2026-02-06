/**
 * CREATE RESEQUENCER: Factory function composing all resequencer modules
 *
 * Responsibility: Wire up all modules and provide public API
 */

import { createStateManager } from '../core/state-manager'
import { createCommitHandler } from '../core/commit-handler'
import { createBufferManager } from '../core/buffer-manager'
import { createMessageProcessor } from '../core/message-processor'
import { createCursorLoader } from '../utils/cursor-loader'
import { createDeduplicatorPlugin } from '../plugins/deduplicator'
import { createAutoHealerPlugin } from '../plugins/auto-healer'
import { createGapDetectorPlugin } from '../plugins/gap-detector'
import { BUFFER_LIMIT } from '../utils/constants'
import { compareStreamId } from '../utils/stream-id'
import type { BasePayload } from '../core/commit-handler'
import type { ResequencerStatus } from '../types/state'
import type { ResequencerConfig } from '../types/config'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('reseq:factory')

export interface SubscriptionState {
  lastSequence: number
  epoch: string | undefined
}

export interface ResequencerAPI<T extends BasePayload> {
  processNewMessage: (
    payload: T & { conversationId: string },
    projectId: string,
  ) => Promise<void>
  processRecoveryBatch: (
    messages: Array<T & { conversationId: string; streamId: string }>,
    projectId: string,
  ) => Promise<void>
  handleSyncRequired: (conversationId: string) => Promise<void>
  resetConversation: (
    conversationId: string,
    projectId?: string,
  ) => Promise<void>
  handleRecoveryGap: (
    conversationId: string,
    projectId: string,
  ) => Promise<void>
  getStatus: (conversationId: string) => ResequencerStatus
  getSubscriptionState: (
    conversationId: string,
    projectId?: string,
  ) => Promise<SubscriptionState>
  refreshAllActive: () => Promise<void>
}

export function createStreamResequencer<T extends BasePayload>(
  config: ResequencerConfig<T>,
): ResequencerAPI<T> {
  // Create core modules
  const cursorLoader = createCursorLoader(config.storageAdapter)
  const stateManager = createStateManager(config.storageAdapter, cursorLoader)
  const commitHandler = createCommitHandler(config.storageAdapter)
  const bufferManager = createBufferManager(commitHandler)
  const messageProcessor = createMessageProcessor(commitHandler, bufferManager)

  // Create plugins
  const builtInPlugins = [
    createDeduplicatorPlugin<T>(),
    createAutoHealerPlugin<T>(),
    createGapDetectorPlugin<T>(
      config.recoveryAdapter,
      bufferManager,
      config.gapConfig,
    ),
  ]

  const allPlugins = [...builtInPlugins, ...(config.customPlugins || [])]

  /**
   * Process new message from WebSocket
   */
  async function processNewMessage(
    payload: T & { conversationId: string },
    projectId: string,
  ): Promise<void> {
    const state = await stateManager.getOrInit(
      payload.conversationId,
      projectId,
    )

    // Project isolation check
    if (state.projectId && state.projectId !== projectId) {
      log.error(
        `Cross-project leak! State: ${state.projectId} vs Incoming: ${projectId}`,
      )
      return
    }

    if (!state.projectId) {
      state.projectId = projectId
    }

    state.lastCommitTs = Date.now()

    // Chain processing to ensure sequential execution
    const task = async () => {
      const isReplay = (payload as any).meta?.replay || false

      await messageProcessor.process(state, payload, {
        projectId,
        isReplay,
        plugins: allPlugins,
      })

      // Check buffer overflow
      if (bufferManager.checkOverflow(state, BUFFER_LIMIT)) {
        log.error(`Buffer overflow (${state.buffer.size})`)
        state.buffer.clear()
        state.status = 'DESYNCED'
        config.recoveryAdapter.triggerRecovery({
          conversationId: state.conversationId,
          projectId: state.projectId,
          lastSequence: state.lastSequence,
          lastStreamId: state.expectedStreamId,
          gapSize: 0,
          attempt: state.recoveryAttempts,
        })
      }
    }

    state.processingChain = state.processingChain.then(task).catch((err) => {
      log.error(`Processing error for ${payload.conversationId}:`, err)
    })

    return state.processingChain
  }

  /**
   * Process recovery batch (sorted messages from server)
   */
  async function processRecoveryBatch(
    messages: Array<T & { conversationId: string; streamId: string }>,
    projectId: string,
  ): Promise<void> {
    if (!messages.length) return

    // Sort by streamId
    const sorted = [...messages].sort((a, b) =>
      compareStreamId(a.streamId, b.streamId),
    )

    const state = await stateManager.getOrInit(
      sorted[0].conversationId,
      projectId,
    )

    // Clear gap timer during batch
    if (state.gapTimer) {
      clearTimeout(state.gapTimer)
      state.gapTimer = null
    }

    const task = async () => {
      for (const msg of sorted) {
        await messageProcessor.process(state, msg, {
          projectId,
          isReplay: true,
          plugins: allPlugins,
        })
      }
      state.status = 'SYNCED'
    }

    state.processingChain = state.processingChain.then(task).catch((err) => {
      log.error(`Recovery batch error:`, err)
    })

    return state.processingChain
  }

  /**
   * Handle sync required signal
   */
  async function handleSyncRequired(conversationId: string): Promise<void> {
    log.warn(`Sync required for ${conversationId}`)

    const state = await stateManager.getOrInit(conversationId)
    state.buffer.clear()
    state.status = 'DESYNCED'

    config.recoveryAdapter.triggerRecovery({
      conversationId: state.conversationId,
      projectId: state.projectId,
      lastSequence: state.lastSequence,
      lastStreamId: state.expectedStreamId,
      gapSize: 0,
      attempt: 0,
    })
  }

  /**
   * Hard reset conversation
   */
  async function resetConversation(
    conversationId: string,
    projectId?: string,
  ): Promise<void> {
    await stateManager.reset(conversationId, projectId)

    const state = await stateManager.getOrInit(conversationId, projectId)
    state.status = 'DESYNCED'

    config.recoveryAdapter.triggerRecovery({
      conversationId: state.conversationId,
      projectId: state.projectId,
      lastSequence: state.lastSequence,
      lastStreamId: state.expectedStreamId,
      gapSize: 0,
      attempt: 0,
    })
  }

  /**
   * Force heal gap (accept gap and move forward)
   */
  async function handleRecoveryGap(
    conversationId: string,
    projectId: string,
  ): Promise<void> {
    const state = await stateManager.getOrInit(conversationId, projectId)

    await bufferManager.flush(state, projectId, 'force')
    state.status = 'SYNCED'

    log.warn(`Force-healed gap for ${conversationId}`)
  }

  /**
   * Get resequencer status
   */
  function getStatus(conversationId: string): ResequencerStatus {
    const state = stateManager.get(conversationId)
    return state?.status || 'SYNCED'
  }

  /**
   * Get subscription state for smart subscriptions
   */
  async function getSubscriptionState(
    conversationId: string,
    projectId?: string,
  ): Promise<SubscriptionState> {
    const state = stateManager.get(conversationId)

    if (state) {
      return {
        lastSequence: state.lastSequence,
        epoch: state.expectedStreamId || undefined,
      }
    }

    // Slow path: load from storage
    const cursor = await cursorLoader.load(conversationId, projectId)
    return {
      lastSequence: cursor.lastSequence,
      epoch: cursor.expectedStreamId || undefined,
    }
  }

  /**
   * Refresh all active states (for leader promotion)
   */
  async function refreshAllActive(): Promise<void> {
    const activeIds = stateManager.getAllActive()
    log.debug(`Refreshing ${activeIds.length} active states`)

    await Promise.all(activeIds.map((id) => stateManager.reload(id)))
  }

  return {
    processNewMessage,
    processRecoveryBatch,
    handleSyncRequired,
    resetConversation,
    handleRecoveryGap,
    getStatus,
    getSubscriptionState,
    refreshAllActive,
  }
}
