import { HugeiconsIcon } from '@hugeicons/react'
import {
  Calendar01Icon,
  GiftIcon,
  PlusSignIcon as PlusIcon,
  SentIcon,
  SmileIcon,
} from '@hugeicons/core-free-icons'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEditRequest } from '../lib/edit-request-context'
import { useReplyRequest } from '../lib/reply-request-context'
import {
  ChatToolbar,
  ChatToolbarAddonEnd,
  ChatToolbarAddonStart,
  ChatToolbarTextarea,
} from './components/chat-layout'
import type { StagedAttachment } from '@/features/chat/media'
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

interface MessageInputProps {
  channelId: string
  projectId: string
  workspaceId: string
}

export function MessageInput({ channelId, projectId, workspaceId }: MessageInputProps) {
  const { userId, getToken } = useAuth()
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
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
  // useLayoutEffect (no deps) runs synchronously after every render —
  // same guarantee as bare assignment, but satisfies react-hooks/refs.
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

      // Stage immediately so preview appears at once
      const staged: StagedAttachment = {
        fileId: tempId,
        name: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        localPreviewUrl,
        uploadProgress: 0,
        file,          // kept for retry on failure
        failed: false,
      }
      setPendingAttachments((prev) => [...prev, staged])

      // Per-file upload toast (bottom-left, Vault-style)
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

        // Replace temp entry with confirmed attachment (uploadProgress = undefined = done)
        setPendingAttachments((prev) =>
          prev.map((a) =>
            a.fileId === tempId
              ? {
                  ...result,
                  localPreviewUrl,
                  uploadProgress: undefined,  // undefined = fully confirmed, no spinner
                }
              : a,
          ),
        )

        toast.success(`${file.name} ready`, { id: uploadToastId })

        // Invalidate quota — file is now ACTIVE and counted
        invalidateVaultQuota(queryClient, projectId)
      } catch (err) {
        // Mark as failed — keep the card visible with a retry button
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
    // Only stable references in deps — quota and count come from refs above.
    [getToken, projectId, workspaceId, channelId, queryClient],
  )

  const handleRetry = useCallback(
    (fileId: string) => {
      const attachment = pendingAttachments.find((a) => a.fileId === fileId)
      if (!attachment?.file) return
      // Remove the failed entry (startUpload will re-stage it with a new tempId)
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
      .filter((a) => a.uploadProgress === undefined)
      .map(({ fileId, name, mimeType, sizeBytes, url }) => ({
        fileId, name, mimeType, sizeBytes, url,
      }))
    const hasAttachments = confirmedAttachments.length > 0

    if (!hasContent && !hasAttachments) return
    if (isUploading) return  // block send while any upload is in progress

    const msg = content
    const parentMessageId = replyingTo?.id
    const metadata = hasAttachments ? { attachments: confirmedAttachments } : undefined

    setContent('')
    setPendingAttachments([])
    clearReply()

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    await sendMessage(msg, channelId, projectId, userId || 'ANONYMOUS', parentMessageId, metadata)
  }

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    // ↑ shortcut: edit last own message when input is empty
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

  // Auto-focus on reply request
  useEffect(() => {
    if (replyingTo) textareaRef.current?.focus()
  }, [replyingTo])

  // Send button active state
  // A 'failed' attachment is not uploading — it's broken. User must retry or remove it.
  const hasFailed = pendingAttachments.some((a) => a.failed === true)
  const canSend =
    (content.trim().length > 0 || pendingAttachments.some((a) => a.uploadProgress === undefined && !a.failed)) &&
    !isUploading &&
    !hasFailed

  return (
    <div className="flex flex-col w-full shrink-0 z-20">
      {/* ── Replying-To Banner ─────────────────────────────────── */}
      {replyingTo && (
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted/60 border-b text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-muted-foreground shrink-0">Replying to</span>
            <strong className="text-foreground shrink-0">{replyingTo.displayName}</strong>
            <span className="text-muted-foreground/60 truncate">{replyingTo.contentSnippet}</span>
          </div>
          <button
            onClick={clearReply}
            className="ml-2 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Cancel reply"
          >
            ✕
          </button>
        </div>
      )}

      <ChatToolbar className="border-t pb-safe overflow-visible">
        <div className="flex flex-col w-full bg-background border rounded-2xl shadow-sm focus-within:ring-1 ring-ring transition-all">

          {/* ── Pending Attachments Strip ─────────────────────── */}
          <ChatAttachmentPreview
            attachments={pendingAttachments}
            onRemove={handleRemoveAttachment}
            onRetry={handleRetry}
          />

          <div className="flex items-end gap-2 p-2">
            <ChatToolbarAddonStart className="pb-1">
              <Button variant="ghost" size="icon" className="size-8 @md/chat:size-9 shrink-0">
                <HugeiconsIcon icon={PlusIcon} className="size-5" />
              </Button>
            </ChatToolbarAddonStart>

            <ChatToolbarTextarea
              ref={textareaRef}
              placeholder="Type your message…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              className="max-h-[200px] py-2.5"
            />

            <ChatToolbarAddonEnd className="pb-1">
              {!canSend ? (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-8 @md/chat:size-9 hidden @md/chat:inline-flex">
                    <HugeiconsIcon icon={GiftIcon} className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8 @md/chat:size-9 hidden @md/chat:inline-flex">
                    <HugeiconsIcon icon={Calendar01Icon} className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8 @md/chat:size-9">
                    <HugeiconsIcon icon={SmileIcon} className="size-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="icon"
                  className="size-8 @md/chat:size-9 rounded-full shrink-0"
                  onClick={handleSend}
                  disabled={isUploading}
                  aria-label="Send message"
                >
                  <HugeiconsIcon icon={SentIcon} className="size-4" />
                </Button>
              )}
            </ChatToolbarAddonEnd>
          </div>

          {/* ── Bottom toolbar: Attach + hints ───────────────── */}
          <div className="flex items-center justify-between px-3 py-1 border-t bg-muted/30 rounded-b-2xl">
            <div className="flex items-center gap-3">
              <ChatAttachmentPicker
                currentAttachmentCount={pendingAttachments.length}
                onFileSelected={startUpload}
                uploading={isUploading}
                disabled={quota.isFull}
              />
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
