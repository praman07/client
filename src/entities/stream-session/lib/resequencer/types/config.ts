/**
 * RESEQUENCER CONFIG: Configuration types
 */

import type { StorageAdapter } from '../adapters/storage-adapter'
import type { RecoveryAdapter } from '../adapters/recovery-adapter'
import type { ProcessorPlugin } from '../plugins/plugin-types'

/**
 * Resequencer configuration
 */
export interface ResequencerConfig<T> {
  storageAdapter: StorageAdapter<T>
  recoveryAdapter: RecoveryAdapter
  gapConfig?: GapDetectorConfig
  customPlugins?: ProcessorPlugin<T>[]
}

/**
 * Gap detector configuration
 */
export interface GapDetectorConfig {
  gapTimeoutMs?: number
  fastForwardThreshold?: number
  maxRecoveryAttempts?: number
  recoveryTimeoutMs?: number
}
