/**
 * MESSAGE PROCESSOR: Core sequencing algorithm with plugin orchestration
 *
 * Responsibility: Process incoming messages, run plugins, handle strict sequencing
 */

import type { StreamSessionState } from '../types/state'
import type { BasePayload, CommitHandler } from './commit-handler'
import type { BufferManager } from './buffer-manager'
import type { PluginContext, ProcessorPlugin } from '../plugins/plugin-types'

export interface ProcessingContext {
  projectId: string
  isReplay: boolean
  plugins: Array<ProcessorPlugin>
}

export interface ProcessingResult {
  success: boolean
  action: 'committed' | 'buffered' | 'skipped' | 'error'
  reason?: string
}

export interface MessageProcessor<T extends BasePayload> {
  process: (
    state: StreamSessionState<T>,
    payload: T,
    context: ProcessingContext,
  ) => Promise<ProcessingResult>
}

export function createMessageProcessor<T extends BasePayload>(
  commitHandler: CommitHandler<T>,
  bufferManager: BufferManager<T>,
): MessageProcessor<T> {
  /**
   * Run pre-process plugins
   */
  async function runPreProcessPlugins(
    pluginContext: PluginContext<T>,
    plugins: Array<ProcessorPlugin<T>>,
  ): Promise<{ shouldContinue: boolean; reason?: string }> {
    const prePlugins = plugins.filter((p) => p.phase === 'pre-process')

    for (const plugin of prePlugins) {
      const result = await plugin.execute(pluginContext)

      if (result.action === 'skip') {
        console.debug(
          `[MessageProcessor] Plugin '${plugin.name}' skipped message: ${result.reason}`,
        )
        return { shouldContinue: false, reason: result.reason }
      }

      if (result.action === 'error') {
        console.error(
          `[MessageProcessor] Plugin '${plugin.name}' error:`,
          result.error,
        )
        return { shouldContinue: false, reason: result.error.message }
      }
    }

    return { shouldContinue: true }
  }

  /**
   * Run post-process plugins
   */
  async function runPostProcessPlugins(
    pluginContext: PluginContext<T>,
    plugins: Array<ProcessorPlugin<T>>,
  ): Promise<void> {
    const postPlugins = plugins.filter((p) => p.phase === 'post-process')

    for (const plugin of postPlugins) {
      try {
        await plugin.execute(pluginContext)
      } catch (e) {
        console.error(
          `[MessageProcessor] Post-process plugin '${plugin.name}' failed:`,
          e,
        )
      }
    }
  }

  /**
   * Process incoming message
   */
  async function process(
    state: StreamSessionState<T>,
    payload: T,
    context: ProcessingContext,
  ): Promise<ProcessingResult> {
    const { projectId, isReplay, plugins } = context

    const pluginContext: PluginContext<T> = {
      state,
      payload,
      projectId,
      isReplay,
    }

    // Run pre-process plugins (deduplication, auto-heal, etc.)
    const preResult = await runPreProcessPlugins(pluginContext, plugins)

    if (!preResult.shouldContinue) {
      return {
        success: true,
        action: 'skipped',
        reason: preResult.reason,
      }
    }

    // Check if strict next sequence
    const isStrictNext = payload.sequence === state.lastSequence + 1

    if (isStrictNext) {
      // Commit message
      console.debug(`[MessageProcessor] Strict next: ${payload.sequence}`)

      const success = await commitHandler.commitWithRetry(
        state,
        payload,
        projectId,
      )

      if (success) {
        // Opportunistic buffer flush
        await bufferManager.flush(state, projectId, 'strict')

        // Run post-process plugins
        await runPostProcessPlugins(pluginContext, plugins)

        return {
          success: true,
          action: 'committed',
        }
      } else {
        // Commit failed - buffer and trigger recovery
        console.error(
          `[MessageProcessor] Commit failed for seq ${payload.sequence}`,
        )

        bufferManager.add(state, payload)
        state.status = 'RECOVERING'

        return {
          success: false,
          action: 'error',
          reason: 'Commit failed',
        }
      }
    }

    // Not strict next - buffer the message
    bufferManager.add(state, payload)

    console.debug(
      `[MessageProcessor] Buffered: ${payload.streamId} (size: ${state.buffer.size})`,
    )

    // Run post-process plugins (gap detection)
    await runPostProcessPlugins(pluginContext, plugins)

    return {
      success: true,
      action: 'buffered',
    }
  }

  return { process }
}
