import { useMemberCache } from '../../lib/member-cache-context'
import { getInitials } from '../../lib/get-initials'
import { useMessageEdit } from '../../lib/use-message-edit'
import { useEditRequest } from '../../lib/edit-request-context'
import {
  MessageEvent,
  MessageEventAddon,
  MessageEventBody,
  MessageEventContent,
  MessageEventDescription,
  MessageEventTitle,
} from './message'
import type { MessageRowData } from '../../model/message-list.types'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import { cn } from '@/shared/lib/utils'
import { createLogger } from '@/shared/lib/logger'
import { useUser } from '@/shared/hooks'
import { Pencil } from 'lucide-react'
import { useEffect } from 'react'

const log = createLogger('chat:message')

function getSafeContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (content && typeof content === 'object' && 'text' in content) {
    return (content as { text: string }).text
  }
  return JSON.stringify(content)
}

interface PrimaryMessageProps {
  message: MessageRowData
  className?: string
}

export function PrimaryMessage({ message, className }: PrimaryMessageProps) {
  const { getMemberInfo } = useMemberCache()
  const memberInfo = getMemberInfo(message.authorId)
  const { user } = useUser()

  const currentContent = getSafeContent(message.content)
  const { isEditing, editValue, setEditValue, startEdit, cancelEdit, submitEdit } =
    useMessageEdit(message.id, currentContent)

  // ↑ shortcut listener: enter edit mode when MessageInput requests it
  const { requestedEditId, clearEditRequest } = useEditRequest()
  useEffect(() => {
    if (requestedEditId === message.id) {
      startEdit()
      clearEditRequest()
    }
  }, [requestedEditId, message.id, startEdit, clearEditRequest])

  log.debug('Looking up authorId:', message.authorId)
  log.debug('Found memberInfo:', memberInfo)

  const displayName = memberInfo?.fullName ?? message.authorId
  const initials = memberInfo
    ? getInitials(memberInfo.fullName)
    : (message.authorId || '?').substring(0, 2).toUpperCase()

  // Only authors can edit; tombstoned messages are not editable
  const isAuthor = user?.id === message.authorId
  const canEdit = isAuthor && !message.deletedAt

  log.debug('Display name:', displayName, 'Initials:', initials)

  return (
    <MessageEvent className={cn('hover:bg-accent/50 group/msg', className)}>
      <MessageEventAddon>
        <Avatar className="rounded-full size-8 @md/chat:size-10 mx-auto border shadow-sm">
          {memberInfo?.avatarUrl && (
            <AvatarImage src={memberInfo.avatarUrl} alt={displayName} />
          )}
          <AvatarFallback className="text-xs font-bold bg-muted">
            {initials}
          </AvatarFallback>
        </Avatar>
      </MessageEventAddon>
      <MessageEventBody>
        <div className="flex items-baseline gap-2">
          <MessageEventTitle className="hover:underline cursor-pointer">
            {displayName}
          </MessageEventTitle>
          <MessageEventDescription>
            {new Intl.DateTimeFormat('en-US', {
              timeStyle: 'short',
            }).format(new Date(message.createdAt))}
          </MessageEventDescription>
        </div>

        {isEditing ? (
          /* ── Edit mode ─────────────────────────────────────── */
          <div className="flex flex-col gap-1 mt-1">
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

            {/* Hover action bar — pencil icon, author-only */}
            {canEdit && (
              <div className="absolute -top-2 right-0 hidden group-hover/msg:flex items-center gap-0.5 bg-background border rounded-md shadow-sm px-1 py-0.5">
                <button
                  onClick={startEdit}
                  className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  title="Edit message"
                  aria-label="Edit message"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </MessageEventBody>
    </MessageEvent>
  )
}
