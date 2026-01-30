import { useMemo, useEffect, useRef } from 'react'
import { useUser } from '@/shared/hooks'
import { useMessageWindow } from '../hooks/use-message-window'
import { useWindowController } from '../hooks/use-window-controller'
import { useHistoryLoader } from '@/entities/chat-session'
import { MESSAGE_WINDOW_SIZE } from '../lib/constants'
import { transformMessages } from '../lib/transform-messages'
import { useChatScroll } from '../hooks/use-chat-scroll'
import {
  PrimaryMessage,
  AdditionalMessage,
  DateSeparator,
  ScrollToBottomButton,
} from './components'

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

  // 3. History Loader: Fetches from Network and feeds to Resequencer
  const { loadMore } = useHistoryLoader()

  // Track if we are fetching to prevent double loads
  const isFetchingRef = useRef(false)

  const handleLoadMore = async () => {
    if (isFetchingRef.current || messages.length === 0) return

    const oldestSeq = messages[0]?.sequence ?? 0
    if (oldestSeq <= 1) {
      console.log('[MessageList] Reached beginning of history.')
      return
    }

    console.log('[MessageList] Fetching history before sequence:', oldestSeq)
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
      console.error('[MessageList] History fetch failed', err)
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
      if (item?.type === 'DATE') return 40
      return item?.isPrimary ? 64 : 28
    },
    getItemKey: (index) => virtualData[index]?.id ?? index,
    onLoadMore: handleLoadMore,
  })

  // 6. Auto-Scroll on My Message (Slack Behavior)
  const { user } = useUser()
  const lastMessage = messages[messages.length - 1]
  const handledMessageRef = useRef<string | null>(null)

  useEffect(() => {
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
            >
              {item.type === 'DATE' && item.timestamp !== undefined ? (
                <DateSeparator timestamp={item.timestamp} />
              ) : item.isPrimary && item.message ? (
                <PrimaryMessage
                  message={item.message}
                  avatarFallback={(item.message.authorId || '?')
                    .substring(0, 2)
                    .toUpperCase()}
                  className="mt-4"
                />
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
