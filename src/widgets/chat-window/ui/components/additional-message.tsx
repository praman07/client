import {
  MessageEvent,
  MessageEventAddon,
  MessageEventBody,
  MessageEventContent,
  MessageEventDescription,
} from './message'
import type { MessageRowData } from '../../model/message-list.types'
import { useMessageEdit } from '../../lib/use-message-edit'
import { useEditRequest } from '../../lib/edit-request-context'
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
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/shared/lib/db'
import type { DBMessage } from '@/shared/lib/db/schema'
import { Pencil, Trash2, Reply, MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { deleteMessage } from '@/features/chat/events/api'
import { useReplyRequest } from '../../lib/reply-request-context'
import { useMemberCache } from '../../lib/member-cache-context'
import { useScrollToMessage } from '../../lib/scroll-to-message-context'

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
  const { isEditing, editValue, setEditValue, startEdit, cancelEdit, submitEdit } =
    useMessageEdit(message.id, currentContent)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
      <MessageEvent className="hover:bg-accent/50 group/msg h-auto py-0.5">
        <MessageEventAddon>
          <MessageEventDescription className="text-right text-[8px] @md/chat:text-[10px] group-hover:visible invisible select-none">
            {new Intl.DateTimeFormat('en-US', {
              timeStyle: 'short',
            }).format(new Date(message.createdAt))}
          </MessageEventDescription>
        </MessageEventAddon>
        <MessageEventBody>
          {/* ── Tombstone ────────────────────────────────────── */}
          {message.deletedAt ? (
            <div className="flex items-center gap-1.5 text-muted-foreground/70 italic text-sm py-0.5 select-none">
              <Trash2 className="h-3 w-3 shrink-0" />
              <span>This message was deleted.</span>
            </div>
          ) : isEditing ? (
            /* ── Edit mode ─────────────────────────────────────── */
            <div className="flex flex-col gap-1">
              <textarea
                autoFocus
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
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
              <p className="text-[10px] text-muted-foreground">
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
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-0.5 border-l-2 border-muted hover:border-primary/60 pl-2 py-0.5 w-full text-left transition-colors"
                >
                  <Reply className="h-3 w-3 shrink-0" />
                  {parentMessage ? (
                    <span>
                      Replying to{' '}
                      <strong className="text-foreground/70">
                        @{getMemberInfo(parentMessage.authorId)?.fullName ?? parentMessage.authorId}
                      </strong>
                      {' '}
                      <span className="text-muted-foreground/60 truncate">
                        {getSafeContent(parentMessage.content).slice(0, 60)}
                      </span>
                    </span>
                  ) : (
                    <span>Replying to a message</span>
                  )}
                </button>
              )}

              <MessageEventContent>
                {currentContent}
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

              {/* Hover action bar — visible to everyone on non-deleted messages */}
              {!message.deletedAt && (
                <div className="absolute -top-2 right-0 hidden group-hover/msg:flex items-center gap-0.5 bg-background border rounded-md shadow-sm px-1 py-0.5">
                  <button
                    onClick={() =>
                      requestReply({
                        id: message.id,
                        authorId: message.authorId,
                        content: currentContent,
                        displayName: getMemberInfo(message.authorId)?.fullName ?? message.authorId,
                        contentSnippet: currentContent.slice(0, 80),
                      })
                    }
                    className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    title="Reply"
                    aria-label="Reply to message"
                  >
                    <Reply className="h-3.5 w-3.5" />
                  </button>
                  {canEdit && (
                    <button
                      onClick={startEdit}
                      className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit message"
                      aria-label="Edit message"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete message"
                      aria-label="Delete message"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* ── Reply Count Badge ─────────────────────────────── */}
              {(message.replyCount ?? 0) > 0 && (
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-0.5 transition-colors">
                  <MessageSquare className="h-3 w-3" />
                  <span>
                    {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
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
