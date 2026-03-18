import { Awareness } from 'y-protocols/awareness'
import type * as Y from 'yjs'

export interface AwarenessUserInfo {
  name: string
  color: string
  avatarUrl?: string
  state?: 'active' | 'idle'
}

/**
 * Factory to create an Awareness instance for a page session
 *
 * Awareness is used for:
 * - Real-time cursor positions (ProseMirror anchor/head, not canvas XY)
 * - User presence information (name, color, avatar)
 * - Idle/active state propagation
 *
 * Note: For pages, the PageAwarenessProvider wraps this instance
 * and connects it to our WebSocket manager so Tiptap's
 * CollaborationCursor extension can use our WS infrastructure instead
 * of Tiptap cloud / Hocuspocus.
 *
 * @layer Entity
 */
export function createPageAwareness(
  ydoc: Y.Doc,
  userInfo?: AwarenessUserInfo,
): Awareness {
  const awareness = new Awareness(ydoc)

  if (userInfo) {
    awareness.setLocalStateField('user', {
      name: userInfo.name,
      color: userInfo.color,
      avatarUrl: userInfo.avatarUrl,
      state: userInfo.state ?? 'active',
    })
    // Tiptap's CollaborationCursor writes the cursor position here
    awareness.setLocalStateField('cursor', null)
  }

  return awareness
}
