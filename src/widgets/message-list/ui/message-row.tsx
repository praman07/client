import { memo, useMemo } from 'react'
import { format, isValid } from 'date-fns'
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import { cn } from '@/shared/lib/utils'
import type { MessageRowData } from '../types/message-list.types'

interface MessageRowProps {
  message: MessageRowData
  isGroupStart?: boolean
  currentUserId: string
  style: React.CSSProperties
  virtualRef: (node: Element | null) => void
}

/**
 * PRODUCTION HARDENING:
 * - Safe Accessors: Never assume data is present (network glitches, optimistic updates).
 * - Error Boundaries: Component-level fallback triggers are expensive, so we check inline.
 */
export const MessageRow = memo(
  ({
    message,
    isGroupStart,
    currentUserId,
    style,
    virtualRef,
  }: MessageRowProps) => {
    // 1. Safe Author Resolution
    const authorId = message.authorId || 'unknown'
    const isMe = authorId === currentUserId

    // 2. Safe Date Parsing
    const timeDisplay = useMemo(() => {
      if (!message.createdAt) return ''
      const date = new Date(message.createdAt)
      return isValid(date) ? format(date, 'h:mm a') : ''
    }, [message.createdAt])

    // 3. Safe Content Rendering
    const renderContent = () => {
      try {
        if (!message.content)
          return <span className="text-destructive italic">Empty message</span>
        if (typeof message.content === 'string') return message.content
        if (typeof message.content === 'object') {
          // @ts-ignore
          return message.content.text || JSON.stringify(message.content)
        }
        return String(message.content)
      } catch (err) {
        return <span className="text-destructive text-xs">Render Error</span>
      }
    }

    return (
      <div
        ref={virtualRef}
        style={style}
        className={cn(
          'flex w-full px-4 py-1',
          isGroupStart ? 'mt-4' : 'mt-0.5',
          isMe ? 'justify-end' : 'justify-start',
        )}
      >
        {/* Avatar (Only for group start & others) */}
        {!isMe && (
          <div className={cn('w-8 mr-2', !isGroupStart && 'opacity-0')}>
            {isGroupStart && (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${authorId}`}
                />
                <AvatarFallback>
                  {authorId.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        )}

        {/* Bubble */}
        <div
          className={cn(
            'max-w-[70%] sm:max-w-[60%] relative group',
            'flex flex-col',
          )}
        >
          {/* Author Name (Group Start) */}
          {!isMe && isGroupStart && (
            <span className="text-xs text-muted-foreground ml-1 mb-1">
              {authorId}
            </span>
          )}

          <div
            className={cn(
              'rounded-2xl px-4 py-2 text-sm shadow-sm',
              isMe
                ? 'bg-primary text-primary-foreground rounded-tr-none'
                : 'bg-secondary text-secondary-foreground rounded-tl-none',
              message.isOptimistic && 'opacity-70',
            )}
          >
            {/* Content */}
            <div className="whitespace-pre-wrap wrap-break-words">
              {renderContent()}
            </div>

            {/* Status Indicator */}
            <div
              className={cn(
                'flex items-center gap-1 mt-1 justify-end',
                'text-[10px] opacity-70',
              )}
            >
              <span>{timeDisplay}</span>
              {isMe && <StatusIcon status={message.deliveryStatus} />}
            </div>
          </div>

          {/* Error Retry Action */}
          {message.deliveryStatus === 'failed' && (
            <div className="text-xs text-destructive flex items-center gap-1 mt-1 cursor-pointer">
              <AlertCircle className="w-3 h-3" />
              <span>Retry</span>
            </div>
          )}
        </div>
      </div>
    )
  },
)

MessageRow.displayName = 'MessageRow'

// -- Helpers --

function StatusIcon({ status }: { status: string }) {
  if (!status) return null // Guard
  if (status === 'pending') return <Clock className="w-3 h-3 animate-pulse" />
  if (status === 'sending') return <Clock className="w-3 h-3 animate-spin" />
  if (status === 'sent') return <Check className="w-3 h-3" />
  if (status === 'delivered') return <CheckCheck className="w-3 h-3" />
  if (status === 'read') return <CheckCheck className="w-3 h-3 text-blue-400" />
  if (status === 'failed') return <AlertCircle className="w-3 h-3" />
  return null
}
