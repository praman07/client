import { HugeiconsIcon } from '@hugeicons/react'
import {
  Attachment01Icon,
  Calendar01Icon,
  GiftIcon,
  PlusSignIcon as PlusIcon,
  SentIcon,
  SmileIcon,
} from '@hugeicons/core-free-icons'
import { useEffect, useRef, useState } from 'react'
import {
  ChatToolbar,
  ChatToolbarAddonEnd,
  ChatToolbarAddonStart,
  ChatToolbarTextarea,
} from './components/chat-layout'
import { useAuth } from '@/shared/hooks'
import { Button } from '@/shared/ui/primitives/button'
import { db } from '@/shared/lib/db'
import { useEditRequest } from '../lib/edit-request-context'

import { sendMessage } from '@/features/chat/events'

interface MessageInputProps {
  channelId: string
  projectId: string
}

export function MessageInput({ channelId, projectId }: MessageInputProps) {
  const { userId } = useAuth()
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { requestEdit } = useEditRequest()

  const handleSend = async () => {
    if (!content.trim()) return
    const msg = content
    setContent('') // Optimistic clear
    await sendMessage(msg, channelId, projectId, userId || 'ANONYMOUS')

    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    // ↑ shortcut: edit last own message when input is empty
    if (e.key === 'ArrowUp' && !content.trim()) {
      e.preventDefault()

      if (!userId) return

      // Find the last non-deleted message in this conversation authored by current user.
      // The compound index [projectId+conversationId+sequence] powers this query.
      const lastOwn = await db.messages
        .where('[projectId+conversationId+sequence]')
        .between(
          [projectId, channelId, 0],
          [projectId, channelId, Infinity],
        )
        .filter((msg) => msg.authorId === userId && !msg.deletedAt)
        .last()

      if (lastOwn) {
        requestEdit(lastOwn.id)
      }
      return
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content])

  return (
    <div className="flex flex-col w-full shrink-0 z-20">
      <ChatToolbar className="border-t pb-safe overflow-visible">
        <div className="flex flex-col w-full bg-background border rounded-2xl shadow-sm focus-within:ring-1 ring-ring transition-all">
          <div className="flex items-end gap-2 p-2">
            <ChatToolbarAddonStart className="pb-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 @md/chat:size-9 shrink-0"
              >
                <HugeiconsIcon icon={PlusIcon} className="size-5" />
              </Button>
            </ChatToolbarAddonStart>

            <ChatToolbarTextarea
              ref={textareaRef}
              placeholder="Type your message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="max-h-[200px] py-2.5"
            />

            <ChatToolbarAddonEnd className="pb-1">
              {!content.trim() ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 @md/chat:size-9 hidden @md/chat:inline-flex"
                  >
                    <HugeiconsIcon icon={GiftIcon} className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 @md/chat:size-9 hidden @md/chat:inline-flex"
                  >
                    <HugeiconsIcon icon={Calendar01Icon} className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 @md/chat:size-9"
                  >
                    <HugeiconsIcon icon={SmileIcon} className="size-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="icon"
                  className="size-8 @md/chat:size-9 rounded-full shrink-0"
                  onClick={handleSend}
                >
                  <HugeiconsIcon icon={SentIcon} className="size-4" />
                </Button>
              )}
            </ChatToolbarAddonEnd>
          </div>

          <div className="flex items-center justify-between px-3 py-1 border-t bg-muted/30 rounded-b-2xl">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-1.5 text-muted-foreground hover:text-foreground"
              >
                <HugeiconsIcon
                  icon={Attachment01Icon}
                  className="size-3.5 mr-1"
                />
                <span className="text-[10px] font-medium">Attach</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-medium">
                <strong>Return</strong> to send
              </span>
            </div>
          </div>
        </div>
      </ChatToolbar>
    </div>
  )
}
