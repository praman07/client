/**
 * EditModeContext — global registry for the currently-editing message.
 *
 * Allows a single document-level mousedown listener to cancel whichever
 * message is currently in edit mode, without coupling the listener to any
 * specific message component.
 *
 * Flow:
 *   1. useMessageEdit (per-message hook) calls registerEdit() when isEditing becomes true
 *   2. EditModeProvider stores a stable cancelRef for that message
 *   3. A document-level mousedown listener calls cancelRef.current() when
 *      the click lands outside [data-inline-edit-box]
 *   4. useMessageEdit calls unregisterEdit() when isEditing becomes false
 *
 * @layer Widgets → chat-window/lib
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type RefObject,
} from 'react'

interface EditModeContextValue {
  /** Set when a message enters edit mode; null otherwise */
  editingMessageId: string | null
  /** Stable ref to the cancel function of the currently-editing message */
  cancelRef: RefObject<() => void> | null
  registerEdit: (messageId: string, cancel: () => void) => void
  unregisterEdit: (messageId: string) => void
}

const EditModeContext = createContext<EditModeContextValue>({
  editingMessageId: null,
  cancelRef: null,
  registerEdit: () => {},
  unregisterEdit: () => {},
})

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const editingMessageIdRef = useRef<string | null>(null)
  const cancelRef = useRef<(() => void) | null>(null)

  const registerEdit = useCallback((messageId: string, cancel: () => void) => {
    editingMessageIdRef.current = messageId
    cancelRef.current = cancel
  }, [])

  const unregisterEdit = useCallback((messageId: string) => {
    if (editingMessageIdRef.current === messageId) {
      editingMessageIdRef.current = null
      cancelRef.current = null
    }
  }, [])

  // Single mousedown listener — cancels edit unless click was inside the edit box
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!editingMessageIdRef.current || !cancelRef.current) return

      const target = e.target as Node | null
      if (target && target instanceof Element) {
        // Don't cancel if the click landed inside (or on) the InlineEditBox
        if (target.closest('[data-inline-edit-box]')) return
      }

      cancelRef.current()
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  return (
    <EditModeContext.Provider
      value={{
        editingMessageId: editingMessageIdRef.current,
        cancelRef: cancelRef.current,
        registerEdit,
        unregisterEdit,
      }}
    >
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditModeContext() {
  return useContext(EditModeContext)
}
