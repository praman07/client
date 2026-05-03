/**
 * EditRequestContext
 *
 * A lightweight mechanism for MessageInput to signal "please enter edit mode
 * for messageId X" to the correct message row component deep in the virtualizer.
 *
 * Why a context and not a prop callback?
 * - MessageList passes down to virtualizer rows, which render PrimaryMessage /
 *   AdditionalMessage. Threading a callback through the virtualizer is brittle.
 * - This context is set once at the ChatWindow level and read by each message
 *   component. It holds only the requested messageId — no re-render cascade.
 *
 * Usage:
 *   - MessageInput: calls requestEdit(messageId) on ArrowUp when input is empty
 *   - PrimaryMessage/AdditionalMessage: useEffect watches requestedEditId;
 *     if it matches their own messageId, they call startEdit() and clear the request
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

interface EditRequestContextValue {
  requestedEditId: string | null
  requestEdit: (messageId: string) => void
  clearEditRequest: () => void
}

const EditRequestContext = createContext<EditRequestContextValue>({
  requestedEditId: null,
  requestEdit: () => {},
  clearEditRequest: () => {},
})

interface EditRequestProviderProps {
  children: React.ReactNode
}

export function EditRequestProvider({ children }: EditRequestProviderProps) {
  const [requestedEditId, setRequestedEditId] = useState<string | null>(null)

  const requestEdit = useCallback((messageId: string) => {
    setRequestedEditId(messageId)
  }, [])

  const clearEditRequest = useCallback(() => {
    setRequestedEditId(null)
  }, [])

  const value = useMemo(
    () => ({ requestedEditId, requestEdit, clearEditRequest }),
    [requestedEditId, requestEdit, clearEditRequest],
  )

  return (
    <EditRequestContext.Provider value={value}>
      {children}
    </EditRequestContext.Provider>
  )
}

export function useEditRequest() {
  return useContext(EditRequestContext)
}
