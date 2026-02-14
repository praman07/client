import { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:conflict-resolver')

/**
 * Resolve conflict between two element versions
 *
 * Y.js handles most conflicts, but we add custom logic for:
 * - versionNonce comparison (higher wins)
 * - Timestamp tiebreaker
 *
 * @returns The winning element
 */
export function resolveConflict(
  local: ExcalidrawElement,
  remote: ExcalidrawElement,
): ExcalidrawElement {
  // Y.js CRDT guarantees eventual consistency
  // We just need to pick the "newer" version

  // 1. Compare versionNonce (Excalidraw's internal version)
  if (local.versionNonce > remote.versionNonce) {
    log.debug('Local wins (versionNonce)', {
      elementId: local.id,
      localVersion: local.versionNonce,
      remoteVersion: remote.versionNonce,
    })
    return local
  }

  if (remote.versionNonce > local.versionNonce) {
    log.debug('Remote wins (versionNonce)', {
      elementId: remote.id,
      localVersion: local.versionNonce,
      remoteVersion: remote.versionNonce,
    })
    return remote
  }

  // 2. Tiebreaker: updated timestamp
  const localUpdated = local.updated || 0
  const remoteUpdated = remote.updated || 0

  if (localUpdated > remoteUpdated) {
    log.debug('Local wins (timestamp)')
    return local
  }

  log.debug('Remote wins (timestamp)')
  return remote
}

/**
 * Check if element needs sync (has changes)
 */
export function needsSync(
  local: ExcalidrawElement | undefined,
  remote: ExcalidrawElement,
): boolean {
  if (!local) return true

  return (
    local.versionNonce !== remote.versionNonce ||
    local.updated !== remote.updated
  )
}
