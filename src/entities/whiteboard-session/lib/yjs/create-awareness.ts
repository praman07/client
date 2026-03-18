import { Awareness } from 'y-protocols/awareness'
import type * as Y from 'yjs'

export interface AwarenessUserInfo {
  name: string
  color: string
  avatarUrl?: string
  state?: 'active' | 'idle'
}

/**
 * Factory to create Awareness instance with optional user info
 *
 * Awareness is used for:
 * - Real-time cursor positions
 * - Selected elements tracking
 * - User presence information
 *
 * @param ydoc - Y.Doc instance to attach awareness to
 * @param userInfo - Optional user information to set initially
 * @returns Configured Awareness instance
 */
export function createAwareness(
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
  }

  return awareness
}
