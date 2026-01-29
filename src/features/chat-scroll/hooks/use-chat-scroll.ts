import { useRef, useState, useLayoutEffect, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

type ScrollMode = 'LOCKED_BOTTOM' | 'FREE_SCROLL' | 'FETCHING_HISTORY'

interface UseChatScrollProps {
  count: number
  estimateSize: (index: number) => number
  getItemKey: (index: number) => number | string
  onLoadMore?: () => void
}

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
        const firstVisibleIndex = virtualHandler.getVirtualItems()[0]?.index
        if (firstVisibleIndex !== undefined) {
          anchorRef.current = {
            key: getItemKey(firstVisibleIndex),
            index: firstVisibleIndex,
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
          count > 0 &&
          onLoadMore
        ) {
          // Transition to FETCHING
          // DEBUG: console.log('[useChatScroll] Mode: FREE_SCROLL → FETCHING_HISTORY')
          isFetchingRef.current = true
          setMode('FETCHING_HISTORY')
          onLoadMore()
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
      if (mode === 'LOCKED_BOTTOM') {
        // Append Case - scroll to bottom
        rowVirtualizer.scrollToIndex(count - 1, {
          align: 'end',
          behavior: 'auto',
        })
      } else if (
        mode === 'FETCHING_HISTORY' ||
        mode === 'FREE_SCROLL' // Check for prepend
      ) {
        // Detect Prepend via Index Shift
        if (anchorRef.current !== null) {
          let newAnchorIndex = -1
          const { key: oldKey, index: oldIndex } = anchorRef.current

          // Search for the key in new list
          for (let i = 0; i < count; i++) {
            if (getItemKey(i) === oldKey) {
              newAnchorIndex = i
              break
            }
          }

          if (newAnchorIndex !== -1) {
            // If index shifted significantly (indicating items added above)
            // OR if we are explicitly FETCHING_HISTORY (known prepend)
            // We perform Manual Scroll Adjustment

            if (newAnchorIndex > oldIndex || mode === 'FETCHING_HISTORY') {
              // PREPEND DETECTED
              const heightDiff = currentScrollHeight - prevScrollHeight
              if (heightDiff > 0) {
                // Manual Adjustment (Instant, No Virtualizer Error)
                // DEBUG: console.log('[useChatScroll] Prepend detected:', { heightDiff })
                parent.scrollTop += heightDiff
              }
            }
          }
        }

        if (mode === 'FETCHING_HISTORY') {
          setMode('FREE_SCROLL')
          isFetchingRef.current = false
        }
      }
    }

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
