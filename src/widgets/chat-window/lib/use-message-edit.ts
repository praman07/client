import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditModeContext } from './edit-mode-context'
import { editMessage } from '@/features/chat/events/api'

/**
 * useMessageEdit — Manages the isEditing toggle for a single message.
 *
 * Design decisions:
 * - All edit content state (text, mentions) lives inside InlineEditBox.
 *   This hook only tracks whether the message is in edit mode.
 * - submitEdit accepts the fully-serialized richContent string produced by
 *   InlineEditBox (either plain text or JSON with mentions).
 * - No optimistic update: the edit box closes immediately after submit,
 *   and the UI reflects the change only after the server's chat:message-edited
 *   broadcast arrives (~50-200ms). This prevents desync if the server rejects
 *   (e.g., concurrent delete won the race).
 * - Nonce is generated fresh on every submit — this satisfies the server's
 *   @@unique([messageId, nonce]) idempotency guard.
 */
export function useMessageEdit(messageId: string, currentContent: string) {
  const [isEditing, setIsEditing] = useState(false)
  const { registerEdit, unregisterEdit } = useEditModeContext()

  // Stable cancel fn — ref so the context always has a fresh reference
  const cancelRef = useRef<() => void>(() => setIsEditing(false))

  // Sync cancelRef whenever edit state changes
  useEffect(() => {
    if (isEditing) {
      cancelRef.current = () => setIsEditing(false)
      registerEdit(messageId, cancelRef.current)
    } else {
      unregisterEdit(messageId)
    }
  }, [isEditing, messageId, registerEdit, unregisterEdit])

  const startEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
  }, [])

  /**
   * Submit the edited message.
   *
   * @param richContent - Fully serialized content from InlineEditBox.
   *   Either a plain string (no mentions) or JSON `{ text, mentions }`.
   */
  const submitEdit = useCallback(
    (richContent: string) => {
      const trimmed = richContent.trim()

      // No-op: don't emit if content is empty or unchanged
      if (!trimmed || trimmed === currentContent.trim()) {
        setIsEditing(false)
        return
      }

      // Fresh nonce per submission — server deduplicates on (messageId, nonce)
      editMessage(messageId, trimmed, crypto.randomUUID())
      setIsEditing(false)
      // UI remains showing old content until chat:message-edited broadcast arrives
    },
    [currentContent, messageId],
  )

  return {
    isEditing,
    startEdit,
    cancelEdit,
    submitEdit,
  }
}
