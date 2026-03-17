import * as Y from 'yjs'
import { createPageDoc } from './yjs/create-ydoc'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('pages:validation')

/**
 * Validate that a binary blob is a parseable Yjs update
 *
 * Uses a temporary Y.Doc with the same shared-type shape as a real page
 * (XmlFragment 'content', Map 'meta', Map 'config') so structural
 * validation is accurate.
 *
 * @layer Entity
 */
export function isValidYjsUpdate(update: Uint8Array): boolean {
  try {
    const tempDoc = createPageDoc({ pageId: 'validation-temp' })
    Y.applyUpdate(tempDoc, update)
    tempDoc.destroy()
    return true
  } catch (error) {
    log.error('Invalid Yjs update', { error })
    return false
  }
}

export function sanitizeYjsUpdate(update: Uint8Array): Uint8Array | null {
  if (!isValidYjsUpdate(update)) {
    return null
  }
  return update
}
