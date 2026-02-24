/**
 * Binary ↔ Base64 encoding utilities for Yjs wire format
 *
 * Yjs updates are Uint8Array. The WebSocket sends JSON so we base64-encode
 * at every boundary crossing (send) and decode on receipt (apply).
 *
 * @layer Entity
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
