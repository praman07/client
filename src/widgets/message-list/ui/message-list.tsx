import { useMemo, useEffect, useRef } from 'react'
import { useChatScroll } from '@/features/chat-scroll/hooks/use-chat-scroll'
import type { MessageRowData } from '../types/message-list.types'
import { Avatar, AvatarFallback } from '@/shared/ui/primitives/avatar'
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventDescription,
  ChatEventTitle,
} from '@/shared/ui/primitives/chat-event'
import { Separator } from '@/shared/ui/primitives/separator'
import { cn } from '@/shared/lib/utils'
import { ArrowDownIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/shared/ui/primitives/button'
import { useUser } from '@/shared/hooks'
import { useMessageWindow } from '../hooks/use-message-window'
import { useWindowController } from '../model/window-controller'
import { useHistoryLoader } from '../hooks/use-history-loader'
import { MESSAGE_WINDOW_SIZE } from '../lib/constants'

interface MessageListProps {
  projectId: string
  channelId: string
  conversationId?: string // Deprecated alias
}

function getSafeContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (content && typeof content === 'object' && 'text' in content) {
    return (content as { text: string }).text
  }
  return JSON.stringify(content)
}

// -- Sub-Components --

function PrimaryMessage({
  message,
  avatarFallback,
  className,
}: {
  message: MessageRowData
  avatarFallback: string
  className?: string
}) {
  return (
    <ChatEvent className={cn('hover:bg-accent/50', className)}>
      <ChatEventAddon>
        <Avatar className="rounded-full size-8 @md/chat:size-10 mx-auto border shadow-sm">
          <AvatarFallback className="text-xs font-bold bg-muted">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </ChatEventAddon>
      <ChatEventBody>
        <div className="flex items-baseline gap-2">
          <ChatEventTitle className="hover:underline cursor-pointer">
            {message.authorId}
          </ChatEventTitle>
          <ChatEventDescription>
            {new Intl.DateTimeFormat('en-US', {
              timeStyle: 'short',
            }).format(new Date(message.createdAt))}
          </ChatEventDescription>
        </div>
        <ChatEventContent>{getSafeContent(message.content)}</ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  )
}

function AdditionalMessage({ message }: { message: MessageRowData }) {
  return (
    <ChatEvent className="hover:bg-accent/50 group h-auto py-0.5">
      <ChatEventAddon>
        <ChatEventDescription className="text-right text-[8px] @md/chat:text-[10px] group-hover:visible invisible select-none">
          {new Intl.DateTimeFormat('en-US', {
            timeStyle: 'short',
          }).format(new Date(message.createdAt))}
        </ChatEventDescription>
      </ChatEventAddon>
      <ChatEventBody>
        <ChatEventContent>{getSafeContent(message.content)}</ChatEventContent>
      </ChatEventBody>
    </ChatEvent>
  )
}

function DateItem({
  timestamp,
  className,
}: {
  timestamp: number
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-4 px-4 my-6', className)}>
      <Separator className="flex-1" />
      <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
        {new Intl.DateTimeFormat('en-US', {
          dateStyle: 'long',
        }).format(new Date(timestamp))}
      </span>
      <Separator className="flex-1" />
    </div>
  )
}

// -- Main Component --

export function MessageList({
  projectId,
  channelId,
  conversationId,
}: MessageListProps) {
  const activeChannelId = channelId || conversationId || ''

  // 1. Window Controller: Manages query bounds
  const { minSequence, maxSequence, loadOlder } = useWindowController(
    0,
    Infinity,
  )

  // 2. Data Provider: Fetches from Dexie based on window bounds
  const { messages } = useMessageWindow({
    conversationId: activeChannelId,
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
        activeChannelId,
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

  // 4. Transformed Data (Dates & Groups)
  const virtualData = useMemo(() => {
    const items: Array<{
      type: 'MESSAGE' | 'DATE'
      message?: MessageRowData
      timestamp?: number
      isPrimary?: boolean
      id: string
    }> = []

    for (let i = 0; i < messages.length; i++) {
      const current = messages[i]
      const prev = messages[i - 1]

      const currentTs = new Date(current.createdAt).getTime()
      const prevTs = prev ? new Date(prev.createdAt).getTime() : 0

      if (Number.isNaN(currentTs)) continue

      // Day boundary check
      if (
        !prev ||
        new Date(current.createdAt).toDateString() !==
          new Date(prev.createdAt).toDateString()
      ) {
        items.push({
          id: `date-${current.createdAt}`,
          type: 'DATE',
          timestamp: currentTs,
        })
      }

      // Grouping check (same sender + within 5 mins)
      const isConsecutive =
        prev &&
        prev.authorId === current.authorId &&
        currentTs - prevTs < 5 * 60 * 1000

      items.push({
        id: current.virtualId,
        type: 'MESSAGE',
        message: current,
        isPrimary: !isConsecutive,
      })
    }

    // DEBUG: VirtualData (uncomment for debugging)
    // console.log('[MessageList] VirtualData:', { messagesCount: messages.length, items: items.length })

    return items
  }, [messages])

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
                <DateItem timestamp={item.timestamp} />
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
      {showScrollButton && (
        <div className="sticky bottom-4 w-full flex justify-center z-50 pointer-events-none">
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full shadow-lg pointer-events-auto h-8 px-3 gap-1.5 opacity-90 hover:opacity-100 transition-opacity"
            onClick={scrollToBottom}
          >
            <HugeiconsIcon icon={ArrowDownIcon} className="size-3.5" />
            <span className="text-xs font-medium">New Messages</span>
          </Button>
        </div>
      )}
    </div>
  )
}
