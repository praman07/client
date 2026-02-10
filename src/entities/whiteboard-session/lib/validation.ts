import * as Y from 'yjs'

export function isValidYjsUpdate(update: Uint8Array): boolean {
  try {
    const tempDoc = new Y.Doc()
    Y.applyUpdate(tempDoc, update)
    tempDoc.destroy()
    return true
  } catch (error) {
    console.error('[Y.js Validation] Invalid update:', error)
    return false
  }
}

export function sanitizeYjsUpdate(update: Uint8Array): Uint8Array | null {
  if (!isValidYjsUpdate(update)) {
    return null
  }
  return update
}
