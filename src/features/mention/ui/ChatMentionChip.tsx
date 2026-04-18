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
  [SearchEntityType.Page]:
    'bg-layer-2 text-primary hover:bg-layer-2-hover',
  [SearchEntityType.Issue]:
    'bg-layer-2 text-primary hover:bg-layer-2-hover',
  [SearchEntityType.VaultFile]:
    'bg-layer-2 text-primary hover:bg-layer-2-hover',
  [SearchEntityType.VaultFolder]:
    'bg-layer-2 text-primary hover:bg-layer-2-hover',
  [SearchEntityType.Whiteboard]:
    'bg-layer-2 text-primary hover:bg-layer-2-hover',
  [SearchEntityType.User]:
    'bg-layer-2 text-primary hover:bg-layer-2-hover',
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
