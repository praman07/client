import type { MessageRowData } from '../model/message-list.types'

export interface VirtualItem {
  type: 'MESSAGE' | 'DATE'
  message?: MessageRowData
  timestamp?: number
  isPrimary?: boolean
  id: string
}

/**
 * Transforms raw messages into virtual items with date separators and grouping.
 *
 * Grouping Rules:
 * - Same author + within 5 minutes = grouped (additional message)
 * - Different author or >5 mins = new group (primary message)
 * - Date separator inserted on day boundary
 */
export function transformMessages(
  messages: Array<MessageRowData>,
): Array<VirtualItem> {
  const items: Array<VirtualItem> = []

  for (let i = 0; i < messages.length; i++) {
    const current = messages[i]
    const prev: MessageRowData | undefined = i > 0 ? messages[i - 1] : undefined

    const currentTs = new Date(current.createdAt).getTime()
    const prevTs = prev ? new Date(prev.createdAt).getTime() : 0

    // Skip invalid dates
    if (Number.isNaN(currentTs)) continue

    // Insert date separator on day boundary
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

    // Check if message should be grouped with previous
    const isConsecutive =
      prev !== undefined &&
      prev.authorId === current.authorId &&
      currentTs - prevTs < 5 * 60 * 1000 // 5 minutes

    items.push({
      id: current.virtualId,
      type: 'MESSAGE',
      message: current,
      isPrimary: !isConsecutive,
    })
  }

  return items
}
