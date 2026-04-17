import { useLiveQuery } from 'dexie-react-hooks'
import { MessageSquare, Pencil, Reply, SmilePlus, Trash2 } from 'lucide-react'
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { useMessageEdit } from '../../lib/use-message-edit'
import { useEditRequest } from '../../lib/edit-request-context'
import { useReplyRequest } from '../../lib/reply-request-context'
import { useMemberCache } from '../../lib/member-cache-context'
import { useScrollToMessage } from '../../lib/scroll-to-message-context'
import {
  MessageEvent,
  MessageEventAddon,
  MessageEventBody,
  MessageEventContent,
  MessageEventDescription,
} from './message'
import type { MessageRowData } from '../../model/message-list.types'
import type { DBMessage } from '@/shared/lib/db/schema'
import type { ReactionGroup } from '@/entities/reaction'
import { cn } from '@/shared/lib/utils'
import { useUser } from '@/shared/hooks'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'
import { db } from '@/shared/lib/db'
import {
  addReaction,
  deleteMessage,
  removeReaction,
} from '@/features/chat/events/api'
import {
  ReactionBadge,
  mergeReactionAdd,
  mergeReactionRemove,
} from '@/entities/reaction'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/primitives/popover'
import { ChatAttachmentRenderer } from '@/features/chat/media'
import { RichChatContent } from './RichChatContent'

// Lazy-load the heavy emoji picker only when opened
const EmojiPicker = lazy(() => import('@emoji-mart/react'))

function getSafeContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (content && typeof content === 'object' && 'text' in content) {
    return (content as { text: string }).text
  }
  return JSON.stringify(content)
}

interface AdditionalMessageProps {
  message: MessageRowData
}

export function AdditionalMessage({ message }: AdditionalMessageProps) {
  const { user } = useUser()
  const { getMemberInfo } = useMemberCache()
  const { requestReply } = useReplyRequest()
  const { scrollToMessage } = useScrollToMessage()

  const currentContent = getSafeContent(message.content)
  const {
    isEditing,
    editValue,
    setEditValue,
    startEdit,
    cancelEdit,
    submitEdit,
  } = useMessageEdit(message.id, currentContent)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  // Resolve parent message from Dexie for the inline reply reference.
  // IMPORTANT: .get(id) uses compound PK — use where('id').equals() instead (v8 index).
  const parentMessage = useLiveQuery<DBMessage | undefined>(
    async () =>
      message.parentMessageId
        ? db.messages.where('id').equals(message.parentMessageId).first()
        : undefined,
    [message.parentMessageId],
  )

  const isAuthor = user?.id === message.authorId
  const canEdit = isAuthor && !message.deletedAt
  const canDelete = isAuthor && !message.deletedAt

  // One-reaction-per-user toggle (WhatsApp / Telegram style):
  // - Pick an emoji you haven't reacted with → adds it (removes any previous reaction first)
  // - Pick the same emoji you already have → removes it (toggle off)
  const isTogglingRef = useRef(false)
  const handleReactionToggle = useCallback(
    async (emoji: string) => {
      if (!user?.id) return
      if (isTogglingRef.current) return
      isTogglingRef.current = true

      const emitOps: Array<() => void> = []

      try {
        await db.transaction('rw', db.messages, async () => {
          const current = await db.messages
            .where('id')
            .equals(message.id)
            .first()
          let reactions = (current?.reactions ?? []) as Array<ReactionGroup>

          // Find any emoji this user has already reacted with
          const userPrevReaction = reactions.find((r) =>
            r.authorIds != null ? r.authorIds.includes(user.id) : r.hasReacted,
          )

          const isSameEmoji = userPrevReaction?.emoji === emoji

          if (isSameEmoji) {
            reactions = mergeReactionRemove(reactions, emoji, user.id, user.id)
            emitOps.push(() => removeReaction(message.id, emoji))
          } else {
            if (userPrevReaction) {
              reactions = mergeReactionRemove(
                reactions,
                userPrevReaction.emoji,
                user.id,
                user.id,
              )
              emitOps.push(() =>
                removeReaction(message.id, userPrevReaction.emoji),
              )
            }
            reactions = mergeReactionAdd(reactions, emoji, user.id, user.id)
            emitOps.push(() => addReaction(message.id, emoji))
          }

          await db.messages
            .where('id')
            .equals(message.id)
            .modify((msg) => {
              msg.reactions = reactions
            })
        })

        emitOps.forEach((fn) => fn())
      } finally {
        isTogglingRef.current = false
      }
    },
    [message.id, user?.id],
  )

  // ↑ shortcut listener: enter edit mode when MessageInput requests it
  const { requestedEditId, clearEditRequest } = useEditRequest()
  useEffect(() => {
    if (requestedEditId === message.id) {
      startEdit()
      clearEditRequest()
    }
  }, [requestedEditId, message.id, startEdit, clearEditRequest])

  const handleConfirmDelete = () => {
    deleteMessage(message.id, crypto.randomUUID())
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <MessageEvent className="hover:bg-accent/50 group/msg">
        <MessageEventAddon>
          <MessageEventDescription className="text-right text-xs group-hover/msg:opacity-100 opacity-0 select-none transition-opacity duration-150">
            {new Intl.DateTimeFormat('en-US', {
              timeStyle: 'short',
            }).format(new Date(message.createdAt))}
          </MessageEventDescription>
        </MessageEventAddon>
        <MessageEventBody>
          {/* ── Tombstone ────────────────────────────────────── */}
          {message.deletedAt ? (
            <div className="flex items-center gap-2 text-muted-foreground/70 italic text-sm py-0.5 select-none">
              <Trash2 className="h-3 w-3 shrink-0" />
              <span>This message was deleted.</span>
            </div>
          ) : isEditing ? (
            /* ── Edit mode ─────────────────────────────────────── */
            <div className="flex flex-col gap-1.5 mt-1.5">
              <textarea
                autoFocus
                className="w-full rounded-md border border-input bg-muted/20 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring min-h-[60px]"
                value={editValue}
                rows={Math.max(2, editValue.split('\n').length)}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.preventDefault()
                    cancelEdit()
                  }
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    submitEdit()
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">escape</span> to cancel •{' '}
                <span className="font-medium">enter</span> to save
              </p>
            </div>
          ) : (
            /* ── Read mode ─────────────────────────────────────── */
            <div className="relative">
              {/* ── Inline Reply Reference ─────────────────────────── */}
              {message.parentMessageId && (
                <button
                  onClick={() => scrollToMessage(message.parentMessageId!)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1 border-l-2 border-muted-foreground/25 hover:border-primary/50 pl-2.5 py-0.5 max-h-10 overflow-hidden w-full text-left transition-colors rounded-sm"
                >
                  <Reply className="h-3 w-3 shrink-0" />
                  {parentMessage ? (
                    <span>
                      Replying to{' '}
                      <strong className="text-foreground/70">
                        @
                        {getMemberInfo(parentMessage.authorId)?.fullName ??
                          parentMessage.authorId}
                      </strong>{' '}
                      <span className="text-muted-foreground/60 truncate inline-flex items-center gap-0.5 flex-wrap">
                        <RichChatContent
                          content={parentMessage.content}
                          maxChars={60}
                        />
                      </span>
                    </span>
                  ) : (
                    <span>Replying to a message</span>
                  )}
                </button>
              )}

              <MessageEventContent>
                <RichChatContent content={message.content} />
                {message.isEdited && (
                  <span
                    className="ml-1 text-[10px] text-muted-foreground/60 italic select-none"
                    title={
                      message.editedAt
                        ? `Edited ${new Intl.DateTimeFormat('en-US', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          }).format(new Date(message.editedAt))}`
                        : 'Edited'
                    }
                  >
                    (edited)
                  </span>
                )}
              </MessageEventContent>

              {/* ── Attachments ─────────────────────────────────────── */}
              {!message.deletedAt &&
                (message.metadata?.attachments ?? []).length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-1.5">
                    {message.metadata!.attachments!.map((attachment) => (
                      <ChatAttachmentRenderer
                        key={attachment.fileId}
                        attachment={attachment}
                      />
                    ))}
                  </div>
                )}

              {/* Hover action bar — visible to everyone on non-deleted messages */}
              {!message.deletedAt && (
                <div
                  className={cn(
                    'absolute -top-3 right-2 z-10 items-center gap-0.5',
                    'bg-background border border-border/60 rounded-lg shadow-md px-1 py-0.5',
                    isPickerOpen ? 'flex' : 'hidden group-hover/msg:flex',
                  )}
                >
                  {/* Emoji picker — lazy loaded */}
                  <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                    <PopoverTrigger
                      className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Add reaction"
                    >
                      <SmilePlus className="size-4" />
                    </PopoverTrigger>
                    <PopoverContent
                      side="top"
                      align="end"
                      className="p-0 w-auto border-0 shadow-none bg-transparent ring-0"
                    >
                      <Suspense
                        fallback={
                          <div className="p-4 text-xs text-muted-foreground">
                            Loading…
                          </div>
                        }
                      >
                        <EmojiPicker
                          data={async () => {
                            const response = await import('@emoji-mart/data')
                            return response.default
                          }}
                          onEmojiSelect={(e: { native: string }) => {
                            handleReactionToggle(e.native)
                            setIsPickerOpen(false)
                          }}
                          theme="auto"
                          previewPosition="none"
                          skinTonePosition="none"
                        />
                      </Suspense>
                    </PopoverContent>
                  </Popover>
                  <button
                    onClick={() =>
                      requestReply({
                        id: message.id,
                        authorId: message.authorId,
                        content: currentContent,
                        displayName:
                          getMemberInfo(message.authorId)?.fullName ??
                          message.authorId,
                        contentSnippet: currentContent.slice(0, 80),
                      })
                    }
                    className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    title="Reply"
                    aria-label="Reply to message"
                  >
                    <Reply className="size-4" />
                  </button>
                  {canEdit && (
                    <button
                      onClick={startEdit}
                      className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit message"
                      aria-label="Edit message"
                    >
                      <Pencil className="size-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete message"
                      aria-label="Delete message"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              )}

              {/* ── Reaction Badges ───────────────────────────────── */}
              {!message.deletedAt && (message.reactions ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {message.reactions!.map((reaction) => (
                    <ReactionBadge
                      key={reaction.emoji}
                      reaction={reaction}
                      onClick={() => handleReactionToggle(reaction.emoji)}
                    />
                  ))}
                </div>
              )}

              {/* ── Reply Count Badge ─────────────────────────────── */}
              {(message.replyCount ?? 0) > 0 && (
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1.5 transition-colors">
                  <MessageSquare className="h-3 w-3" />
                  <span>
                    {message.replyCount}{' '}
                    {message.replyCount === 1 ? 'reply' : 'replies'}
                  </span>
                </button>
              )}
            </div>
          )}
        </MessageEventBody>
      </MessageEvent>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The message will be permanently
              removed for everyone in the conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
