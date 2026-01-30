import { useCallback, useRef, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMessageWindow } from '../hooks/use-message-window'
import { useWindowController } from './use-window-controller'
import { useScrollController } from './use-scroll-controller'
import { useHistoryLoader } from '@/entities/chat-session'
import { MESSAGE_WINDOW_SIZE } from '../lib/constants'

interface UseMessageListProps {
  conversationId: string
  projectId: string
  containerRef: React.RefObject<HTMLDivElement | null>
}

/**
 * The Main Orchestrator Hook.
 * Composes Data, Windowing, and Scroll Logic into a single API for the View.
 */
export function useMessageList({
  conversationId,
  projectId,
  containerRef,
}: UseMessageListProps) {
  // 1. Setup Windowing
  const { minSequence, maxSequence, loadOlder } = useWindowController(
    0,
    Infinity,
  )

  // 2. Data Provider
  const { messages, isLoading } = useMessageWindow({
    conversationId,
    projectId,
    minSequence: minSequence === 0 ? 0 : minSequence,
    maxSequence,
  })

  // 3. History Loader
  const { loadMore } = useHistoryLoader()

  const handleFetchHistory = useCallback(async () => {
    if (!messages.length) return

    const oldestSeq = messages[0].sequence || 0
    if (oldestSeq <= 1) return // Reached absolute start

    console.log('[MessageList] Fetching history before', oldestSeq)

    const count = await loadMore(
      conversationId,
      projectId,
      oldestSeq,
      MESSAGE_WINDOW_SIZE,
    )

    if (count > 0) {
      // Expand window to include new items
      loadOlder(count)
    }
  }, [conversationId, projectId, loadMore, messages, loadOlder])

  // 4. Virtualizer
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 60, // Default row height
    overscan: 5,
    getItemKey: (index) => messages[index].virtualId,
  })

  // 5. Scroll Controller
  const { mode, handleScroll, jumpToBottom, showScrollButton } =
    useScrollController({
      virtualizer,
      totalItems: messages.length,
      onFetchHistory: handleFetchHistory,
    })

  // 6. Init Effect: Snap to End on First Load
  // Only if we haven't scrolled yet.
  const isMounted = useRef(false)
  useEffect(() => {
    if (!isLoading && messages.length > 0 && !isMounted.current) {
      virtualizer.scrollToIndex(messages.length - 1, { align: 'end' })
      isMounted.current = true
    }
  }, [isLoading, messages.length, virtualizer])

  return {
    messages,
    virtualizer,
    mode,
    scrollProps: {
      onScroll: handleScroll,
      ref: containerRef,
    },
    actions: {
      jumpToBottom,
    },
    ui: {
      showScrollButton,
      isLoading,
    },
  }
}
