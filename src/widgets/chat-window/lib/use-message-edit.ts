import { useState, useCallback } from 'react'
import { editMessage } from '@/features/chat/events/api'

/**
 * useMessageEdit — Encapsulates all edit-mode state for a single message.
 *
 * Design decisions:
 * - No optimistic update: the edit textarea closes immediately after submit,
 *   and the UI reflects the change only after the server's chat:message-edited
 *   broadcast arrives (~50-200ms). This prevents desync if the server rejects
 *   (e.g., concurrent delete won the race).
 * - editValue is reset to currentContent on every startEdit() call to ensure
 *   the textarea always shows the server-confirmed content, not a stale draft.
 * - Nonce is generated fresh on every submit — this satisfies the server's
 *   @@unique([messageId, nonce]) idempotency guard.
 */
export function useMessageEdit(messageId: string, currentContent: string) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(currentContent)

  const startEdit = useCallback(() => {
    // Always reset to current committed content when entering edit mode.
    // This ensures that if the message was updated by another edit event
    // since the component last rendered, we're editing the latest content.
    setEditValue(currentContent)
    setIsEditing(true)
  }, [currentContent])

  const cancelEdit = useCallback(() => {
    setEditValue(currentContent)
    setIsEditing(false)
  }, [currentContent])

  const submitEdit = useCallback(() => {
    const trimmed = editValue.trim()

    // No-op cases: don't emit if content is empty or unchanged
    if (!trimmed || trimmed === currentContent.trim()) {
      setIsEditing(false)
      return
    }

    // Fresh nonce per submission — server deduplicates on (messageId, nonce)
    editMessage(messageId, trimmed, crypto.randomUUID())
    setIsEditing(false)
    // UI remains showing old content until chat:message-edited broadcast arrives
  }, [editValue, currentContent, messageId])

  return {
    isEditing,
    editValue,
    setEditValue,
    startEdit,
    cancelEdit,
    submitEdit,
  }
}
