/**
 * ChatMentionChip — read-only mention chip for chat message rendering.
 *
 * Simpler than `MentionChip` (no BlockNote inlineContent wrapper, no useNavigate).
 * Receives flat props directly from `RichChatContent`.
 *
 * @layer Features → mention/ui
 */
import { SearchEntityType } from '@/gql/graphql'
import { useNavigateToEntity } from '@/features/mention/lib/navigate-to-entity'

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ChatMentionChipProps {
  entityId:    string
  entityType:  string
  displayText: string
}

// ── Chip color map (mirrors MentionChip) ──────────────────────────────────────

const CHIP_COLORS: Record<string, string> = {
  // Documents — Indigo
  [SearchEntityType.Page]:
    'bg-label-indigo-bg text-label-indigo-text hover:bg-label-indigo-hover border border-subtle',
  [SearchEntityType.VaultFile]:
    'bg-label-indigo-bg text-label-indigo-text hover:bg-label-indigo-hover border border-subtle',
  [SearchEntityType.VaultFolder]:
    'bg-label-indigo-bg text-label-indigo-text hover:bg-label-indigo-hover border border-subtle',

  // Tasks — Orange
  [SearchEntityType.Issue]:
    'bg-label-orange-bg text-label-orange-text hover:bg-label-orange-hover border border-subtle',

  // Canvases — Emerald (teal equivalent)
  [SearchEntityType.Whiteboard]:
    'bg-label-emerald-bg text-label-emerald-text hover:bg-label-emerald-hover border border-subtle',

  // People — Purple
  [SearchEntityType.User]:
    'bg-label-purple-bg text-label-purple-text hover:bg-label-purple-hover border border-subtle',
}

const DEFAULT_COLOR = 'bg-layer-2 text-secondary hover:bg-layer-2-hover'

// ── Component ─────────────────────────────────────────────────────────────────

export function ChatMentionChip({ entityId, entityType, displayText }: ChatMentionChipProps) {
  const navigateToEntity = useNavigateToEntity()

  const isOrphaned = !entityId
  const colorClass = isOrphaned
    ? 'bg-danger-subtle text-danger-primary line-through cursor-not-allowed'
    : (CHIP_COLORS[entityType] ?? DEFAULT_COLOR)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (isOrphaned) return
    navigateToEntity(entityId, entityType)
  }

  return (
    <span
      className={`mention-chip inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-13 font-medium transition-colors duration-100 select-none cursor-pointer ${colorClass}`}
      onClick={handleClick}
      title={isOrphaned ? 'This entity no longer exists' : `${entityType}: ${displayText}`}
    >
      <span aria-hidden="true">@</span>
      <span>{displayText || entityId}</span>
    </span>
  )
}
