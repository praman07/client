/**
 * PROCESSOR PLUGIN: Plugin system types
 */

import type { StreamSessionState } from '../types/state'

/**
 * Plugin execution context
 */
export interface PluginContext<T = any> {
  state: StreamSessionState<T>
  payload: T
  projectId: string
  isReplay: boolean
}

/**
 * Plugin execution result
 */
export type PluginResult =
  | { action: 'continue' }
  | { action: 'skip'; reason: string }
  | { action: 'error'; error: Error }

/**
 * Plugin execution phase
 */
export type PluginPhase = 'pre-process' | 'post-process'

/**
 * Processor plugin interface
 * Allows extending resequencer behavior without modifying core
 */
export interface ProcessorPlugin<T = any> {
  name: string
  phase: PluginPhase
  execute: (context: PluginContext<T>) => Promise<PluginResult>
}
