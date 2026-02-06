/**
 * Centralized Logger Factory
 *
 * Creates loggers with hierarchical flag resolution:
 * Resolution Priority: FILE > GROUP > ALL
 *
 * @example
 * import { createLogger } from '@/shared/lib/logger'
 *
 * const log = createLogger('chat:scroll')
 * log.debug('Prepend adjustment:', { heightDiff })
 */
import { ALL, FILES, GROUPS } from './debug-flags'
import type { GroupFlag } from './debug-flags'

type FileFlag = string

/**
 * Extract group from file flag
 * @example getGroup('chat:scroll') → 'chat'
 */
const getGroup = (flag: FileFlag): GroupFlag | null => {
  const [group] = flag.split(':')
  return group in GROUPS ? (group as GroupFlag) : null
}

/**
 * Check if logging is enabled for a given flag
 * Resolution: FILE > GROUP > ALL
 */
const isEnabled = (flag: FileFlag): boolean => {
  // Production: always disabled
  if (!import.meta.env.DEV) return false

  // File-level override (explicit true/false)
  const fileFlag = FILES[flag]
  if (fileFlag !== undefined) return fileFlag

  // Group-level
  const group = getGroup(flag)
  if (group && GROUPS[group]) return true

  // ALL flag (master switch)
  return ALL
}

/**
 * Logger interface returned by createLogger
 */
interface Logger {
  /**
   * Debug level - only in dev + flag enabled
   */
  debug: (...args: Array<unknown>) => void
  /**
   * Info level - only in dev + flag enabled
   */
  info: (...args: Array<unknown>) => void
  /**
   * Warn level - always shown (production + dev)
   */
  warn: (...args: Array<unknown>) => void
  /**
   * Error level - always shown (production + dev)
   */
  error: (...args: Array<unknown>) => void
}

/**
 * Create a logger for a specific file/feature
 *
 * @param flag - The file flag (e.g., 'chat:scroll', 'ws:manager')
 * @returns Logger instance with debug, info, warn, error methods
 *
 * @example
 * const log = createLogger('chat:scroll')
 * log.debug('Layout effect:', { mode, delta })
 */
export function createLogger(flag: FileFlag): Logger {
  const prefix = `[${flag}]`

  return {
    get debug() {
      if (isEnabled(flag)) return console.debug.bind(console, prefix)
      return () => {}
    },
    get info() {
      if (isEnabled(flag)) return console.info.bind(console, prefix)
      return () => {}
    },
    warn: console.warn.bind(console, prefix),
    error: console.error.bind(console, prefix),
  }
}
