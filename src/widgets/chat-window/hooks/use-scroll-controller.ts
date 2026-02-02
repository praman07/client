import { useCallback, useEffect, useRef, useState } from 'react'
import { isNearBottom, isNearTop } from '../lib/scroll-math'
import { BOTTOM_THRESHOLD, PREFETCH_THRESHOLD } from '../lib/constants'
import type { Virtualizer } from '@tanstack/react-virtual'
import type { MessageListScrollMode } from '../model/message-list.types'

interface ScrollControllerProps {
  virtualizer: Virtualizer<HTMLDivElement, Element>
  totalItems: number
  onFetchHistory: () => void
}

/**
 * The Brain of the Message List.
 * Decides WHEN to scroll, WHAT mode we are in, and WHEN to fetch.
 */
export function useScrollController({
  virtualizer,
  totalItems,
  onFetchHistory,
}: ScrollControllerProps) {
  const [mode, setMode] = useState<MessageListScrollMode>('LOCKED_BOTTOM')
  const [showScrollButton, setShowScrollButton] = useState(false)

  // Refs for debouncing and state tracking without re-renders
  const isFetchingRef = useRef(false)
  const modeRef = useRef(mode)
  modeRef.current = mode

  // 1. Detect Scroll Intent
  // Attached to the generic onScroll event of the container
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      const { scrollTop, clientHeight, scrollHeight } = target

      // A. Detect "Stuck to Bottom"
      const isBottom = isNearBottom(
        scrollTop,
        clientHeight,
        scrollHeight,
        BOTTOM_THRESHOLD,
      )

      if (isBottom) {
        if (modeRef.current !== 'LOCKED_BOTTOM') {
          setMode('LOCKED_BOTTOM')
          setShowScrollButton(false)
        }
      } else {
        if (modeRef.current === 'LOCKED_BOTTOM') {
          setMode('FREE_SCROLL')
          // Add debounced delay for button?
          setShowScrollButton(true)
        }
      }

      // B. Detect "Top Fetch" (History)
      const isTop = isNearTop(scrollTop, PREFETCH_THRESHOLD)
      if (isTop && !isFetchingRef.current && totalItems > 0) {
        isFetchingRef.current = true
        onFetchHistory()
        // Reset ref is handled by the consumer acknowledging completion,
        // or we use a timeout/effect. Ideally passed in prop 'isFetching'.
        // For now, we just fire event.
      }
    },
    [totalItems, onFetchHistory],
  )

  // 2. Auto-Scroll Effect
  useEffect(() => {
    if (mode === 'LOCKED_BOTTOM' && totalItems > 0) {
      try {
        virtualizer.scrollToIndex(totalItems - 1, { align: 'end' })
      } catch (e) {
        /* Virtualizer might not be ready */
      }
    }
  }, [mode, totalItems, virtualizer])

  // 3. Manual Jump
  const jumpToBottom = useCallback(() => {
    setMode('LOCKED_BOTTOM')
    virtualizer.scrollToIndex(totalItems - 1, { align: 'end' })
  }, [virtualizer, totalItems])

  return {
    mode,
    showScrollButton,
    handleScroll,
    jumpToBottom,
    setIsFetching: (val: boolean) => {
      isFetchingRef.current = val
    },
  }
}
