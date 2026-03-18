import * as Y from 'yjs'
import { createYDoc } from './yjs/create-ydoc' // ✅ Import centralized factory
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('whiteboard:validation')

export function isValidYjsUpdate(update: Uint8Array): boolean {
  try {
    // ✅ Use temp boardId for validation
    const tempDoc = createYDoc({ boardId: 'validation-temp' })
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
