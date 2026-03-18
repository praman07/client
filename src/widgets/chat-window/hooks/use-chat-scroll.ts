'use no memo'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:scroll')

type ScrollMode = 'LOCKED_BOTTOM' | 'FREE_SCROLL' | 'FETCHING_HISTORY'

interface UseChatScrollProps {
  count: number
  estimateSize: (index: number) => number
  getItemKey: (index: number) => number | string
  onLoadMore?: () => void
}

'use no memo'
/**
 * Production-Grade Chat Scroll Controller
 *
 * Implements strict Slack/WhatsApp behavior:
 * - LOCKED_BOTTOM: Sticky scroll, enters at <40px, exits at >80px (Hysteresis).
 * - FREE_SCROLL: Manual control, never auto-scrolls.
 * - FETCHING_HISTORY: Maintains visual anchor by Key (not pixels) during prepend.
 */
export function useChatScroll({
  count,
  estimateSize,
  getItemKey,
  onLoadMore,
}: UseChatScrollProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  // State Machine
  const [mode, setMode] = useState<ScrollMode>('LOCKED_BOTTOM')
  const [showScrollButton, setShowScrollButton] = useState(false)

  // Virtualizer
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan: 25,
    getItemKey,
  })

  // State Refs (for layout effects)
  const isFetchingRef = useRef(false)
  const prevCountRef = useRef(count)

  // Anchor Tracking: Key + Index to detect Prepend vs Append
  const anchorRef = useRef<{ key: string | number; index: number } | null>(null)

  // Height Tracking: To calculate delta for manual adjustment
  const prevScrollHeightRef = useRef(0)

  // PREPEND SIGNAL: Decoupled from mode state for correct timing
  // Stays true from trigger until layout adjustment is complete
  const isPrependingRef = useRef(false)
  const prependScrollHeightRef = useRef(0)

  // EDGE CASE: Fetch cooldown to prevent rapid-fire requests
  const lastFetchTimeRef = useRef(0)
  const FETCH_COOLDOWN_MS = 500

  // EDGE CASE: Track if user scrolled during load (if so, don't adjust)
  const userScrolledDuringLoadRef = useRef(false)

  // 1. Scroll Sensor (The Input)
  const onScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      const { scrollTop, scrollHeight, clientHeight } = target
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)

      // Hysteresis Thresholds
      const ENTER_BOTTOM_THRESHOLD = 40
      const EXIT_BOTTOM_THRESHOLD = 80
      const TOP_THRESHOLD = 50

      // Update Scroll Height Tracker constantly
      prevScrollHeightRef.current = scrollHeight

      // Update Anchor Key in FREE_SCROLL (for potential prepend recovery)
      if (mode === 'FREE_SCROLL') {
        const virtualHandler = rowVirtualizer // Access current instance
        const items = virtualHandler.getVirtualItems()
        if (items.length > 0) {
          const firstItem = items[0]
          anchorRef.current = {
            key: getItemKey(firstItem.index),
            index: firstItem.index,
          }
        }
      }

      // State Transitions
      if (mode === 'LOCKED_BOTTOM') {
        if (distanceFromBottom > EXIT_BOTTOM_THRESHOLD) {
          // DEBUG: console.log('[useChatScroll] Mode: LOCKED_BOTTOM → FREE_SCROLL')
          setMode('FREE_SCROLL')
          setShowScrollButton(true)
        }
      } else if (mode === 'FREE_SCROLL') {
        if (distanceFromBottom <= ENTER_BOTTOM_THRESHOLD) {
          // DEBUG: console.log('[useChatScroll] Mode: FREE_SCROLL → LOCKED_BOTTOM')
          setMode('LOCKED_BOTTOM')
          setShowScrollButton(false)
        } else if (
          scrollTop <= TOP_THRESHOLD &&
          !isFetchingRef.current &&
          !isPrependingRef.current &&
          count > 0 &&
          onLoadMore &&
          Date.now() - lastFetchTimeRef.current > FETCH_COOLDOWN_MS
        ) {
          // CRITICAL: Capture scroll height BEFORE triggering load
          // This ensures we can calculate the exact height delta after prepend
          prependScrollHeightRef.current = scrollHeight
          isPrependingRef.current = true
          isFetchingRef.current = true
          userScrolledDuringLoadRef.current = false // Reset scroll tracking
          lastFetchTimeRef.current = Date.now() // Record fetch time
          setMode('FETCHING_HISTORY')
          onLoadMore()

          // FALLBACK: Clear prepending state after 5s if fetch fails/returns 0
          setTimeout(() => {
            if (isPrependingRef.current) {
              log.debug('[Timeout] Clearing stuck prepending state')
              isPrependingRef.current = false
              isFetchingRef.current = false
            }
          }, 5000)
        } else if (isFetchingRef.current || isPrependingRef.current) {
          // User scrolled while we're loading - don't auto-adjust
          userScrolledDuringLoadRef.current = true
        }
      }
    },
    [mode, count, onLoadMore, getItemKey, rowVirtualizer],
  )

  // 2. The Actuator (useLayoutEffect)
  useLayoutEffect(() => {
    const parent = parentRef.current
    if (!parent) return

    const prevCount = prevCountRef.current
    const delta = count - prevCount
    const currentScrollHeight = parent.scrollHeight
    const prevScrollHeight = prevScrollHeightRef.current

    // DEBUG: LayoutEffect logging (uncomment for debugging)
    // if (delta !== 0) console.log('[useChatScroll] LayoutEffect:', { mode, delta, count })

    if (delta > 0) {
      log.debug('LayoutEffect:', {
        mode,
        delta,
        count,
        isPrepending: isPrependingRef.current,
        currentScrollHeight,
        capturedHeight: prependScrollHeightRef.current,
      })

      if (mode === 'LOCKED_BOTTOM') {
        // Append Case - scroll to bottom
        rowVirtualizer.scrollToIndex(count - 1, {
          align: 'end',
          behavior: 'auto',
        })
      } else if (isPrependingRef.current) {
        // PREPEND CASE: Use captured height for precise adjustment
        // This is the key fix - we use the height captured BEFORE the load
        const heightDiff = currentScrollHeight - prependScrollHeightRef.current

        // If user scrolled during load, skip adjustment (they took control)
        if (userScrolledDuringLoadRef.current) {
          log.debug('User scrolled during load, skipping adjustment')
        } else if (heightDiff > 0) {
          log.debug('Prepend adjustment:', {
            heightDiff,
            scrollTopBefore: parent.scrollTop,
          })
          // Adjust scroll position to maintain visual anchor
          parent.scrollTop += heightDiff
          log.debug('Adjusted scrollTop to:', parent.scrollTop)
        }

        // Clear prepend state AFTER adjustment
        isPrependingRef.current = false
        isFetchingRef.current = false
        userScrolledDuringLoadRef.current = false
        setMode('FREE_SCROLL')
      } else if (mode === 'FREE_SCROLL') {
        // Fallback: Detect prepend via anchor index shift (edge cases)
        if (anchorRef.current !== null) {
          const { key: oldKey, index: oldIndex } = anchorRef.current

          for (let i = 0; i < count; i++) {
            if (getItemKey(i) === oldKey && i > oldIndex) {
              // Index shifted = items added above
              const heightDiff = currentScrollHeight - prevScrollHeight
              if (heightDiff > 0) {
                parent.scrollTop += heightDiff
              }
              break
            }
          }
        }
      }
    }
    // NOTE: Removed the delta === 0 edge case that was clearing isPrependingRef
    // This caused a race condition: re-renders from state changes (loadOlder)
    // would clear the flag before the actual messages arrived from DB

    // Capture state for next run
    prevCountRef.current = count
    // Important: Re-capture height *after* rendering current frame
    prevScrollHeightRef.current = parent.scrollHeight

    // Attempt to re-anchor if we have a valid key
    if (mode === 'FREE_SCROLL' && anchorRef.current && delta > 0) {
      // Update the anchor index to the new position so future comparisons work
      const { key } = anchorRef.current
      for (let i = 0; i < count; i++) {
        if (getItemKey(i) === key) {
          anchorRef.current.index = i
          break
        }
      }
    }
  }, [count, mode, rowVirtualizer, getItemKey])

  // 3. Manual Override
  const scrollToBottom = useCallback(() => {
    setMode('LOCKED_BOTTOM')
    setShowScrollButton(false)
    if (parentRef.current) {
      rowVirtualizer.scrollToIndex(count - 1, {
        align: 'end',
        behavior: 'auto',
      })
    }
  }, [count, rowVirtualizer])

  return {
    parentRef,
    rowVirtualizer,
    onScroll,
    scrollToBottom,
    showScrollButton,
    isAtBottom: mode === 'LOCKED_BOTTOM',
  }
}
