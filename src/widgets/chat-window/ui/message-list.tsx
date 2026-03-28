import { useEffect, useMemo, useRef, useCallback } from 'react'
import { useMessageWindow } from '../hooks/use-message-window'
import { useWindowController } from '../hooks/use-window-controller'
import { MESSAGE_WINDOW_SIZE } from '../lib/constants'
import { transformMessages } from '../lib/transform-messages'
import { useChatScroll } from '../hooks/use-chat-scroll'
import { useMessageAuthors } from '../hooks/use-message-authors'
import {
  AdditionalMessage,
  DateSeparator,
  PrimaryMessage,
  ScrollToBottomButton,
} from './components'
import { useHistoryLoader } from '@/entities/chat-session'
import { useUser } from '@/shared/hooks'
import { createLogger } from '@/shared/lib/logger'
import { useScrollToMessage } from '../lib/scroll-to-message-context'

const log = createLogger('chat:messageList')

interface MessageListProps {
  projectId: string
  channelId: string
}

export function MessageList({ projectId, channelId }: MessageListProps) {
  // 1. Window Controller: Manages query bounds
  const { minSequence, maxSequence, loadOlder } = useWindowController(
    0,
    Infinity,
  )

  // 2. Data Provider: Fetches from Dexie based on window bounds
  const { messages } = useMessageWindow({
    conversationId: channelId,
    projectId,
    minSequence,
    maxSequence,
  })

  // 3. Batch fetch missing message authors
  useMessageAuthors(messages)

  // 4. History Loader: Fetches from Network and feeds to Resequencer
  const { loadMore } = useHistoryLoader()

  // Track if we are fetching to prevent double loads
  const isFetchingRef = useRef(false)

  const handleLoadMore = async () => {
    if (isFetchingRef.current || messages.length === 0) return

    const oldestSeq = messages[0]?.sequence ?? 0
    if (oldestSeq <= 1) {
      log.debug('Reached beginning of history.')
      return
    }

    log.debug('Fetching history before sequence:', oldestSeq)
    isFetchingRef.current = true

    try {
      const count = await loadMore(
        channelId,
        projectId,
        oldestSeq,
        MESSAGE_WINDOW_SIZE,
      )
      if (count > 0) {
        loadOlder(count)
      }
    } catch (err) {
      log.error('History fetch failed', err)
    } finally {
      isFetchingRef.current = false
    }
  }

  // 4. Transform messages (dates + grouping)
  const virtualData = useMemo(() => transformMessages(messages), [messages])

  // 5. Scroll Architecture
  const {
    rowVirtualizer,
    parentRef,
    onScroll,
    showScrollButton,
    scrollToBottom,
  } = useChatScroll({
    count: virtualData.length,
    estimateSize: (index) => {
      const item = virtualData[index]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- virtualizer calls estimateSize with stale indices during transitions
      if (item?.type === 'DATE') return 40
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- same as above
      return item?.isPrimary ? 64 : 28
    },
     
    getItemKey: (index) => virtualData[index]?.id ?? String(index),
    onLoadMore: handleLoadMore,
  })

  // Register scroll-to-message with the context so message components can trigger it.
  // Uses virtualizer index lookup: finds which index corresponds to the given messageId
  // by scanning virtualData (already in memory, O(n) but bounded by window size).
  const { registerScroll, highlightedMessageId } = useScrollToMessage()

  const scrollToMessageFn = useCallback((messageId: string): boolean => {
    // item.id = virtualId (dedupeId||streamId) — NOT the server UUID.
    // item.message.id is the server-assigned UUID that parentMessageId references.
    const idx = virtualData.findIndex(
      (item) => item.type === 'MESSAGE' && item.message?.id === messageId,
    )
    if (idx === -1) return false
    rowVirtualizer.scrollToIndex(idx, { behavior: 'smooth', align: 'center' })
    return true
  }, [virtualData, rowVirtualizer])

  // Re-register whenever the function reference changes
  useEffect(() => {
    registerScroll(scrollToMessageFn)
  }, [registerScroll, scrollToMessageFn])

  // 6. Auto-Scroll on My Message (Slack Behavior)
  const { user } = useUser()
  const lastMessage = messages[messages.length - 1]
  const handledMessageRef = useRef<string | null>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- lastMessage is undefined when Dexie window is loading
    if (!lastMessage || !user) return

    const msgId = lastMessage.virtualId
    if (
      msgId !== handledMessageRef.current &&
      lastMessage.authorId === user.id
    ) {
      scrollToBottom()
      handledMessageRef.current = msgId
    }
  }, [lastMessage, user, scrollToBottom])

  return (
    <div
      ref={parentRef}
      onScroll={onScroll}
      className="flex-1 w-full overflow-y-auto no-scrollbar bg-background/50 min-h-0 relative"
      style={{ overflowAnchor: 'none' }}
    >
      <div
        className="relative w-full"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = virtualData[virtualRow.index]
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- item can be undefined during virtualizer transitions
          if (!item) return null

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              data-message-id={item.type === 'MESSAGE' ? item.id : undefined}
              ref={rowVirtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className={
                item.type === 'MESSAGE' && item.message?.id === highlightedMessageId
                  ? 'bg-amber-500/10 border-l-2 border-amber-400/70 rounded-r transition-colors duration-1000'
                  : 'transition-colors duration-1000'
              }
            >
              {item.type === 'DATE' && item.timestamp !== undefined ? (
                <DateSeparator timestamp={item.timestamp} />
              ) : item.isPrimary && item.message ? (
                <PrimaryMessage message={item.message} className="mt-4" />
              ) : item.message ? (
                <AdditionalMessage message={item.message} />
              ) : null}
            </div>
          )
        })}
      </div>

      {/* Floating Scroll Button */}
      <ScrollToBottomButton onClick={scrollToBottom} show={showScrollButton} />
    </div>
  )
}
