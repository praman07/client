import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useMessageWindow } from '../hooks/use-message-window'
import { useWindowController } from '../hooks/use-window-controller'
import { MESSAGE_WINDOW_SIZE } from '../lib/constants'
import {  transformMessages } from '../lib/transform-messages'
import { useChatScroll } from '../hooks/use-chat-scroll'
import { useMessageAuthors } from '../hooks/use-message-authors'
import { useScrollToMessage } from '../lib/scroll-to-message-context'
import {
  ChannelGreetingBanner,
  ScrollToBottomButton,
  VirtualRow,
} from './components'
import type {VirtualItem} from '../lib/transform-messages';
import { useHistoryLoader } from '@/entities/chat-session'
import { useUser } from '@/shared/hooks'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:messageList')

interface MessageListProps {
  projectId: string
  channelId: string
  channelName: string
  isDm?: boolean
  createdAt?: string
  otherUser?: {
    fullName?: string | null
    avatarUrl?: string | null
  }
}

export function MessageList({
  projectId,
  channelId,
  channelName,
  isDm,
  createdAt,
  otherUser,
}: MessageListProps) {
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
  const greetingItem = useMemo<VirtualItem>(() => ({
    id: 'channel-greeting',
    type: 'GREETING',
    greetingType: isDm ? 'DM' : 'CHANNEL',
    channelName,
    createdAt,
    otherUser,
  }), [isDm, channelName, createdAt, otherUser])

  const virtualData = useMemo(() => {
    const items = transformMessages(messages)
    return [greetingItem, ...items]
  }, [messages, greetingItem])

  // 5. Scroll Architecture
  const {
    rowVirtualizer,
    parentRef,
    onScroll,
    showScrollButton,
    newMessagesCount,
    scrollToBottom,
  } = useChatScroll({
    count: virtualData.length,
    estimateSize: (index) => {
      const item = virtualData[index]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- virtualizer calls estimateSize with stale indices during transitions
      if (!item) return 40
      if (item.type === 'DATE') return 40
      if (item.type === 'GREETING') return 140  // Banner height estimate

      // Media-aware estimates: images use a 4:3 aspect-ratio container (320×240 + label).
      // Without this, all messages estimate at 28-64px, causing aggressive remeasurement
      // when image containers expand from 0px to ~260px on load (primary jank source).
      const attachments = item.message?.metadata?.attachments ?? []
      if (attachments.length > 0) {
        const firstMime = attachments[0]?.mimeType ?? ''
        if (firstMime.startsWith('image/')) return 280  // 4:3 at 320px wide ≈ 240px + text + padding
        if (firstMime.startsWith('video/') || firstMime.startsWith('audio/')) return 76  // card height
        return 70  // generic file card
      }

      return item.isPrimary ? 72 : 36
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
      className="flex-1 w-full overflow-y-auto scrollbar-hide bg-surface-1 min-h-0 relative"
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
            <VirtualRow
              key={virtualRow.key}
              item={item}
              virtualRow={virtualRow}
              measureElement={rowVirtualizer.measureElement}
              highlightedMessageId={highlightedMessageId}
            />
          )
        })}
      </div>

      {/* Floating Scroll Button */}
      <ScrollToBottomButton onClick={scrollToBottom} show={showScrollButton} newMessagesCount={newMessagesCount} />
    </div>
  )
}
