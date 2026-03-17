/**
 * Element Content Hash
 *
 * djb2 hash over element id+version pairs only.
 * Excalidraw increments `version` on every mutation — reliable change signal
 * at ~10x less cost than hashing full geometry JSON.
 */

import type { ExcalidrawElement } from '@excalidraw/excalidraw/element/types'

export function hashElements(elements: ReadonlyArray<ExcalidrawElement>): number {
  const str = JSON.stringify(
    elements.map((e) => ({ id: e.id, version: e.version })),
  )
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i)
  }
  return hash >>> 0
}
