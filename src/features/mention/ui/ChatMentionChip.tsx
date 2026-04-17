/**
 * ChatMentionChip — read-only mention chip for chat message rendering.
 *
 * Simpler than `MentionChip` (no BlockNote inlineContent wrapper, no useNavigate).
 * Receives flat props directly from `RichChatContent`.
 *
 * @layer Features → mention/ui
 */
import { SearchEntityType } from '@/gql/graphql'
import { buildEntityRoute } from '@/features/mention/lib/navigate-to-entity'
import { useNavigate } from '@tanstack/react-router'

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ChatMentionChipProps {
  entityId:    string
  entityType:  string
  displayText: string
}

// ── Chip color map (mirrors MentionChip) ──────────────────────────────────────

const CHIP_COLORS: Record<string, string> = {
  [SearchEntityType.Page]:        'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300',
  [SearchEntityType.Issue]:       'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300',
  [SearchEntityType.VaultFile]:   'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300',
  [SearchEntityType.VaultFolder]: 'bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-900/40 dark:text-teal-300',
  [SearchEntityType.Whiteboard]:  'bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/40 dark:text-violet-300',
  [SearchEntityType.User]:        'bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300',
}

const DEFAULT_COLOR = 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'

// ── Component ─────────────────────────────────────────────────────────────────

export function ChatMentionChip({ entityId, entityType, displayText }: ChatMentionChipProps) {
  const navigate = useNavigate()

  const isOrphaned = !entityId
  const colorClass = isOrphaned
    ? 'bg-red-50 text-red-400 line-through cursor-not-allowed dark:bg-red-900/30 dark:text-red-400'
    : (CHIP_COLORS[entityType] ?? DEFAULT_COLOR)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (isOrphaned) return
    const route = buildEntityRoute(entityId, entityType)
    if (route) void navigate({ to: route })
  }

  return (
    <span
      className={`mention-chip inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-sm font-medium transition-colors select-none cursor-pointer ${colorClass}`}
      onClick={handleClick}
      title={isOrphaned ? 'This entity no longer exists' : `${entityType}: ${displayText}`}
    >
      <span aria-hidden="true">@</span>
      <span>{displayText || entityId}</span>
    </span>
  )
}
