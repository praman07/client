import * as Y from 'yjs'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:validation')

export function isValidYjsUpdate(update: Uint8Array): boolean {
  try {
    const tempDoc = new Y.Doc()
    Y.applyUpdate(tempDoc, update)
    tempDoc.destroy()
    return true
  } catch (error) {
    log.error('Invalid Y.js update:', error)
    return false
  }
}

export function sanitizeYjsUpdate(update: Uint8Array): Uint8Array | null {
  if (!isValidYjsUpdate(update)) {
    return null
  }
  return update
}
