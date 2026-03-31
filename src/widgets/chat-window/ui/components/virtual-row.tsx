/**
 * VirtualRow — memoized wrapper for a single virtualizer row.
 *
 * Extracted from message-list.tsx's inline `map()` to prevent React from
 * re-creating JSX objects for every visible row on every scroll frame (60fps).
 *
 * Equality check: skips re-render if the row's position and message content
 * haven't changed. This is safe because all message mutations (edit, delete,
 * reactions) update `updatedAt` and `reactions` which are in the check.
 *
 * @layer Widgets → chat-window/ui/components
 */

import React from 'react'
import { AdditionalMessage } from './additional-message'
import { DateSeparator } from './date-separator'
import { PrimaryMessage } from './primary-message'
import type { VirtualItem as TanstackVirtualItem } from '@tanstack/react-virtual'
import type { VirtualItem } from '../../lib/transform-messages'

interface VirtualRowProps {
  item: VirtualItem
  virtualRow: TanstackVirtualItem
  measureElement: (el: Element | null) => void
  highlightedMessageId: string | null
}

export const VirtualRow = React.memo(
  function VirtualRow({ item, virtualRow, measureElement, highlightedMessageId }: VirtualRowProps) {
    return (
      <div
        data-index={virtualRow.index}
        data-message-id={item.type === 'MESSAGE' ? item.id : undefined}
        ref={measureElement}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          transform: `translateY(${virtualRow.start}px)`,
        }}
        className={
          item.type === 'MESSAGE' && item.message?.id === highlightedMessageId
            ? 'bg-amber-500/10 border-l-2 border-amber-400/70 rounded-r transition-colors duration-1000'
            : 'transition-colors duration-1000'
        }
      >
        {item.type === 'DATE' && item.timestamp !== undefined ? (
          <DateSeparator timestamp={item.timestamp} />
        ) : item.isPrimary && item.message ? (
          <PrimaryMessage message={item.message} className="mt-4" />
        ) : item.message ? (
          <AdditionalMessage message={item.message} />
        ) : null}
      </div>
    )
  },
  (prev, next) =>
    // Skip re-render if position and content are identical
    prev.virtualRow.start === next.virtualRow.start &&
    prev.virtualRow.index === next.virtualRow.index &&
    prev.item.id === next.item.id &&
    prev.item.message?.updatedAt === next.item.message?.updatedAt &&
    prev.item.message?.deletedAt === next.item.message?.deletedAt &&
    prev.item.message?.reactions === next.item.message?.reactions &&
    prev.item.message?.replyCount === next.item.message?.replyCount &&
    prev.highlightedMessageId === next.highlightedMessageId,
)
