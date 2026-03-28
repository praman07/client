/**
 * Scroll-to-Message Context
 *
 * Allows any descendant (e.g. inline reply references) to programmatically
 * scroll to a specific message in the virtualised message list and briefly
 * highlight it.
 *
 * The MessageList component registers the scroll function via `registerScroll`.
 * Message components call `scrollToMessage(id)`.
 */
import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from 'react'

interface ScrollToMessageContextValue {
  /**
   * Scroll to a message by its ID.
   * Returns false if the message is not in the current virtual window.
   */
  scrollToMessage: (messageId: string) => boolean
  /** The message ID currently highlighted (briefly flashes after scroll). */
  highlightedMessageId: string | null
  /** Called by MessageList to register the imperative scroll function. */
  registerScroll: (fn: (messageId: string) => boolean) => void
}

const ScrollToMessageContext = createContext<ScrollToMessageContextValue | null>(null)

export function ScrollToMessageProvider({ children }: { children: ReactNode }) {
  const scrollFnRef = useRef<((messageId: string) => boolean) | null>(null)
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null)

  const registerScroll = useCallback((fn: (messageId: string) => boolean) => {
    scrollFnRef.current = fn
  }, [])

  const scrollToMessage = useCallback((messageId: string): boolean => {
    if (!scrollFnRef.current) return false
    const found = scrollFnRef.current(messageId)
    if (found) {
      // Brief 1.5s highlight then clear
      setHighlightedMessageId(messageId)
      setTimeout(() => setHighlightedMessageId(null), 1500)
    }
    return found
  }, [])

  return (
    <ScrollToMessageContext.Provider
      value={{ scrollToMessage, highlightedMessageId, registerScroll }}
    >
      {children}
    </ScrollToMessageContext.Provider>
  )
}

export function useScrollToMessage() {
  const ctx = useContext(ScrollToMessageContext)
  if (!ctx) throw new Error('useScrollToMessage must be inside ScrollToMessageProvider')
  return ctx
}
