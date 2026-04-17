/**
 * RichChatContent — renders a chat message content string that may contain
 * structured mention data.
 *
 * Content can be:
 *   1. Plain string (legacy messages or messages without mentions)
 *   2. JSON: { text: string, mentions: MentionRef[] }
 *
 * When structured, the text is split at mention positions and
 * `ChatMentionChip` is interleaved between the text spans.
 *
 * @layer Widgets → chat-window
 */
import React from 'react'
import { ChatMentionChip } from '@/features/mention'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MentionRef {
  entityId:    string
  entityType:  string
  displayText: string
  /** Character offset in `text` where this mention appears */
  offset:      number
}

interface RichContent {
  text:     string
  mentions: MentionRef[]
}

// ── Parse ─────────────────────────────────────────────────────────────────────

function parseContent(raw: unknown): { plain: string } | { rich: RichContent } {
  if (typeof raw === 'string') {
    // Try to parse as JSON rich content
    try {
      const parsed = JSON.parse(raw) as unknown
      if (
        parsed !== null &&
        typeof parsed === 'object' &&
        'text' in parsed &&
        'mentions' in parsed &&
        typeof (parsed as RichContent).text === 'string' &&
        Array.isArray((parsed as RichContent).mentions)
      ) {
        return { rich: parsed as RichContent }
      }
    } catch {
      // Not JSON — plain string
    }
    return { plain: raw }
  }

  if (raw && typeof raw === 'object' && 'text' in raw) {
    return { plain: (raw as { text: string }).text }
  }

  return { plain: String(raw ?? '') }
}

// ── Build segments ────────────────────────────────────────────────────────────

interface TextSegment  { kind: 'text';    value: string }
interface ChipSegment  { kind: 'mention'; mention: MentionRef; key: string }
type Segment = TextSegment | ChipSegment

function buildSegments(text: string, mentions: MentionRef[]): Segment[] {
  if (!mentions.length) return [{ kind: 'text', value: text }]

  // Sort mentions by offset ascending
  const sorted = [...mentions].sort((a, b) => a.offset - b.offset)

  const segments: Segment[] = []
  let cursor = 0

  for (const mention of sorted) {
    const start = mention.offset
    // Length of the @displayText that was inserted into the text
    const tokenLen = mention.displayText.length + 1 // +1 for the @ prefix

    if (start > cursor) {
      segments.push({ kind: 'text', value: text.slice(cursor, start) })
    }
    segments.push({
      kind: 'mention',
      mention,
      key: `${mention.entityId}_${start}`,
    })
    cursor = start + tokenLen
  }

  if (cursor < text.length) {
    segments.push({ kind: 'text', value: text.slice(cursor) })
  }

  return segments
}

// ── Component ─────────────────────────────────────────────────────────────────

interface RichChatContentProps {
  /** Raw message content — string or legacy object with .text */
  content: unknown
  /**
   * Optional character limit for preview contexts (e.g. reply reference).
   * Truncates plain text segments; mention chips count as displayText.length + 1.
   */
  maxChars?: number
}

export function RichChatContent({ content, maxChars }: RichChatContentProps) {
  const parsed = parseContent(content)

  // Plain string path (legacy + no-mention messages)
  if ('plain' in parsed) {
    const text = maxChars ? parsed.plain.slice(0, maxChars) + (parsed.plain.length > maxChars ? '\u2026' : '') : parsed.plain
    return <>{text}</>
  }

  const { text, mentions } = parsed.rich
  const segments = buildSegments(text, mentions)

  if (!maxChars) {
    return (
      <>
        {segments.map((seg, i) =>
          seg.kind === 'text' ? (
            <span key={i}>{seg.value}</span>
          ) : (
            <ChatMentionChip
              key={seg.key}
              entityId={seg.mention.entityId}
              entityType={seg.mention.entityType}
              displayText={seg.mention.displayText}
            />
          ),
        )}
      </>
    )
  }

  // Truncated rich render — count chars consumed across segments
  let remaining = maxChars
  const nodes: React.ReactNode[] = []
  let truncated = false

  for (let i = 0; i < segments.length; i++) {
    if (remaining <= 0) { truncated = true; break }
    const seg = segments[i]
    if (seg.kind === 'text') {
      const slice = seg.value.slice(0, remaining)
      nodes.push(<span key={i}>{slice}</span>)
      remaining -= slice.length
      if (slice.length < seg.value.length) { truncated = true; break }
    } else {
      const cost = seg.mention.displayText.length + 1 // @mention
      if (cost > remaining) { truncated = true; break }
      nodes.push(
        <ChatMentionChip
          key={seg.key}
          entityId={seg.mention.entityId}
          entityType={seg.mention.entityType}
          displayText={seg.mention.displayText}
        />
      )
      remaining -= cost
    }
  }

  return <>{nodes}{truncated && <span>…</span>}</>
}
