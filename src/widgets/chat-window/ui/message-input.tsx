import { HugeiconsIcon } from '@hugeicons/react'
import {
  SmileIcon,
} from '@hugeicons/core-free-icons'
import { AtSign, Bold, Link2 } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEditRequest } from '../lib/edit-request-context'
import { useReplyRequest } from '../lib/reply-request-context'
import {
  ChatToolbar,
  ChatToolbarTextarea,
} from './components/chat-layout'
import type { StagedAttachment } from '@/features/chat/media'
import type { MentionRef } from '@/widgets/chat-window/ui/components/RichChatContent'
import { RichChatContent } from '@/widgets/chat-window/ui/components/RichChatContent'
import { Separator } from '@/shared/ui/primitives/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui/primitives/tooltip'
import { cn } from '@/shared/lib/utils'
import { useAuth } from '@/shared/hooks'
import { Button } from '@/shared/ui/primitives/button'
import { db } from '@/shared/lib/db'
import { sendMessage } from '@/features/chat/events'
import {
  ChatAttachmentPicker,
  ChatAttachmentPreview,
  ChatMediaUploadError,
  extractFileFromClipboard,
  invalidateVaultQuota,
  uploadChatMedia,
  useVaultQuota,
} from '@/features/chat/media'
import { ChatMentionTrigger } from '@/features/mention'

interface MessageInputProps {
  channelId: string
  projectId: string
  workspaceId: string
  channelName?: string
}

export function MessageInput({ channelId, projectId, workspaceId, channelName }: MessageInputProps) {
  const { userId, getToken } = useAuth()
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
  const [mentions, setMentions] = useState<Array<MentionRef>>([])
  const [isMentionMenuOpen, setIsMentionMenuOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { requestEdit } = useEditRequest()
  const { replyingTo, clearReply } = useReplyRequest()

  // ── Attachment state ────────────────────────────────────────────────────────
  const [pendingAttachments, setPendingAttachments] = useState<Array<StagedAttachment>>([])
  const isUploading = pendingAttachments.some(
    (a) => a.uploadProgress !== undefined && a.uploadProgress < 100,
  )

  // ── Quota ───────────────────────────────────────────────────────────────────
  const { quota } = useVaultQuota(projectId)

  // Keep refs so startUpload/picker callbacks always read fresh values
  // without needing to be in useCallback deps (which would recreate them on
  // every quota or attachment-count change).
  const quotaRef = useRef(quota)
  const attachmentCountRef = useRef(pendingAttachments.length)
  useLayoutEffect(() => {
    quotaRef.current = quota
    attachmentCountRef.current = pendingAttachments.length
  })

  const startUpload = useCallback(
    async (file: File) => {
      const token = await getToken()
      if (!token) {
        toast.error('Not authenticated. Please refresh.')
        return
      }

      const tempId = `temp-${crypto.randomUUID()}`
      const localPreviewUrl = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : undefined

      const staged: StagedAttachment = {
        fileId: tempId,
        name: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        localPreviewUrl,
        uploadProgress: 0,
        file,
        failed: false,
      }
      setPendingAttachments((prev) => [...prev, staged])

      const uploadToastId = toast.loading(`Uploading ${file.name}…`)

      try {
        const result = await uploadChatMedia(file, {
          projectId,
          workspaceId,
          conversationId: channelId,
          token,
          availableBytes: quotaRef.current.availableBytes,
          currentAttachmentCount: attachmentCountRef.current,
          onProgress: (percent) => {
            setPendingAttachments((prev) =>
              prev.map((a) => (a.fileId === tempId ? { ...a, uploadProgress: percent } : a)),
            )
            toast.loading(`Uploading ${file.name} — ${percent}%`, { id: uploadToastId })
          },
        })

        setPendingAttachments((prev) =>
          prev.map((a) =>
            a.fileId === tempId
              ? { ...result, localPreviewUrl, uploadProgress: undefined }
              : a,
          ),
        )

        toast.success(`${file.name} ready`, { id: uploadToastId })
        invalidateVaultQuota(queryClient, projectId)
      } catch (err) {
        setPendingAttachments((prev) =>
          prev.map((a) =>
            a.fileId === tempId
              ? { ...a, uploadProgress: undefined, failed: true }
              : a,
          ),
        )

        if (err instanceof ChatMediaUploadError) {
          toast.error(err.message, { id: uploadToastId })
        } else {
          toast.error('Upload failed. Press ↺ to retry.', { id: uploadToastId })
        }
      }
    },
    [getToken, projectId, workspaceId, channelId, queryClient],
  )

  const handleRetry = useCallback(
    (fileId: string) => {
      const attachment = pendingAttachments.find((a) => a.fileId === fileId)
      if (!attachment?.file) return
      setPendingAttachments((prev) => {
        const a = prev.find((x) => x.fileId === fileId)
        if (a?.localPreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(a.localPreviewUrl)
        return prev.filter((x) => x.fileId !== fileId)
      })
      void startUpload(attachment.file)
    },
    [pendingAttachments, startUpload],
  )

  const handleRemoveAttachment = useCallback((fileId: string) => {
    setPendingAttachments((prev) => {
      const removed = prev.find((a) => a.fileId === fileId)
      if (removed?.localPreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(removed.localPreviewUrl)
      }
      return prev.filter((a) => a.fileId !== fileId)
    })
  }, [])

  // ── Paste handler ───────────────────────────────────────────────────────────

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const file = extractFileFromClipboard(e.nativeEvent)
      if (!file) return  // text paste — let default behavior happen
      e.preventDefault()
      void startUpload(file)
    },
    [startUpload],
  )

  // ── Send ────────────────────────────────────────────────────────────────────

  const handleSend = async () => {
    const hasContent = content.trim().length > 0
    const confirmedAttachments = pendingAttachments
      .filter((a) => a.uploadProgress === undefined && !a.failed)
      .map(({ fileId, name, mimeType, sizeBytes, url }) => ({
        fileId, name, mimeType, sizeBytes, url,
      }))
    const hasAttachments = confirmedAttachments.length > 0

    if (!hasContent && !hasAttachments) return
    if (isUploading) return

    // Serialize: plain string when no mentions, structured JSON when mentions present
    const richContent = mentions.length > 0
      ? JSON.stringify({ text: content, mentions })
      : content

    const parentMessageId = replyingTo?.id
    const metadata = hasAttachments ? { attachments: confirmedAttachments } : undefined

    setContent('')
    setMentions([])
    setPendingAttachments([])
    clearReply()

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    await sendMessage(richContent, channelId, projectId, userId || 'ANONYMOUS', parentMessageId, metadata)

    // TODO: createMentions for chat requires the server-assigned message CUID.
    // sendMessage is WS fire-and-forget (returns void) — no ID is available here.
    // Hook into new-message-handler.ts ACK path to create backlink records.
  }

  // ── Keyboard handler ────────────────────────────────────────────────────────

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. Let the mention menu consume the event first
    if (ChatMentionTrigger._keyHandler?.(e)) return

    // 2. ↑ shortcut: edit last own message when input is empty
    if (e.key === 'ArrowUp' && !content.trim()) {
      e.preventDefault()
      if (!userId) return

      const lastOwn = await db.messages
        .where('[projectId+conversationId+sequence]')
        .between([projectId, channelId, 0], [projectId, channelId, Infinity])
        .filter((msg) => msg.authorId === userId && !msg.deletedAt)
        .last()

      if (lastOwn) requestEdit(lastOwn.id)
      return
    }

    // 3. Enter sends — but NOT while the mention menu is open
    if (e.key === 'Enter' && !e.shiftKey && !isMentionMenuOpen) {
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

  // Auto-focus on reply request
  useEffect(() => {
    if (replyingTo) textareaRef.current?.focus()
  }, [replyingTo])

  // Send button active state
  const hasFailed = pendingAttachments.some((a) => a.failed === true)
  const canSend =
    (content.trim().length > 0 || pendingAttachments.some((a) => a.uploadProgress === undefined && !a.failed)) &&
    !isUploading &&
    !hasFailed

  return (
    <div className="flex flex-col w-full shrink-0 z-20 relative">

      {/* ── Replying-To Banner ──────────────────────────────────── */}
      {replyingTo && (
        <div className="flex items-center justify-between px-4 py-2 bg-layer-2 rounded-t-xl border-subtle-1 border-b-0 text-11">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-secondary shrink-0">Replying to</span>
            <strong className="text-primary shrink-0">{replyingTo.displayName}</strong>
            <span className="text-tertiary truncate inline-flex items-center gap-0.5 flex-wrap">
              <RichChatContent content={replyingTo.content} maxChars={80} />
            </span>
          </div>
          <button
            onClick={clearReply}
            className="ml-2 shrink-0 text-secondary hover:text-danger-primary transition-colors text-14 leading-none"
            aria-label="Cancel reply"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Mention Trigger ──────────────────────────────────────── */}
      <ChatMentionTrigger
        projectId={projectId}
        content={content}
        onContentChange={setContent}
        mentions={mentions}
        onMentionsChange={setMentions}
        inputRef={textareaRef}
        onMenuOpen={setIsMentionMenuOpen}
      />

      <ChatToolbar className="pb-safe overflow-visible">
        <div
          className={cn(
            'flex flex-col w-full rounded-xl border-subtle-1 bg-layer-1',
            replyingTo && 'rounded-tl-none rounded-tr-none',
          )}
        >

          {/* ── Attachment Preview Strip ─────────────────────── */}
          <ChatAttachmentPreview
            attachments={pendingAttachments}
            onRemove={handleRemoveAttachment}
            onRetry={handleRetry}
          />

          {/* ── Zone 1: Textarea ─────────────────────────────── */}
          <div className="px-4 pt-3 pb-2">
            <ChatToolbarTextarea
              ref={textareaRef}
              placeholder={`Message #${channelName ?? channelId}…`}
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                // Notify trigger after React flushes — selectionStart is accurate
                requestAnimationFrame(() => ChatMentionTrigger._checkTrigger?.())
              }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              className="max-h-[180px] text-sm leading-relaxed"
            />
          </div>

          {/* ── Separator ────────────────────────────────────── */}
          <Separator />

          {/* ── Zone 2: Action Bar ───────────────────────────── */}
          <div className="flex items-center justify-between px-3 h-11">

            {/* Left: Attachment picker + formatting buttons */}
            <div className="flex items-center gap-0.5">
              <ChatAttachmentPicker
                currentAttachmentCount={pendingAttachments.length}
                onFileSelected={startUpload}
                uploading={isUploading}
                disabled={quota.isFull}
              />
              <Separator orientation="vertical" className="h-4 mx-1.5" />
              <Tooltip>
                <TooltipTrigger
                  className="size-7 inline-flex items-center justify-center rounded-md text-disabled cursor-not-allowed"
                  disabled
                  aria-label="Bold (coming soon)"
                >
                  <Bold className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent side="top">Bold (coming soon)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  className="size-7 inline-flex items-center justify-center rounded-md text-disabled cursor-not-allowed"
                  disabled
                  aria-label="Link (coming soon)"
                >
                  <Link2 className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent side="top">Link (coming soon)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  className="size-7 inline-flex items-center justify-center rounded-md text-secondary hover:text-primary hover:bg-accent-subtle transition-colors"
                  aria-label="Mention"
                  onClick={() => {
                    const textarea = textareaRef.current
                    if (!textarea) return
                    const pos = textarea.selectionStart ?? textarea.value.length
                    const before = content.slice(0, pos)
                    const after  = content.slice(pos)
                    const needsSpace = before.length > 0 && !/\s$/.test(before)
                    const insertion = needsSpace ? ' @' : '@'
                    setContent(before + insertion + after)
                    setTimeout(() => {
                      textarea.focus()
                      const nextPos = pos + insertion.length
                      textarea.setSelectionRange(nextPos, nextPos)
                      requestAnimationFrame(() => ChatMentionTrigger._checkTrigger?.())
                    }, 0)
                  }}
                >
                  <AtSign className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent side="top">Mention</TooltipContent>
              </Tooltip>
            </div>

            {/* Right: Emoji + SEND pill */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-secondary hover:text-primary"
                aria-label="Add emoji (coming soon)"
                disabled
              >
                <HugeiconsIcon icon={SmileIcon} className="size-4" />
              </Button>
              <Button
                size="sm"
                className="h-7 px-3.5 rounded-full text-xs font-semibold uppercase tracking-wide"
                onClick={handleSend}
                disabled={!canSend || isUploading}
                aria-label="Send message"
              >
                Send
              </Button>
            </div>
          </div>

        </div>
      </ChatToolbar>
    </div>
  )
}
