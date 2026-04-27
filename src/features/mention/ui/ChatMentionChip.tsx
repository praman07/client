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
  // Documents — muted blue/indigo tint
  [SearchEntityType.Page]:
    'bg-[hsl(220_50%_55%/0.12)] text-[hsl(220_70%_70%)] hover:bg-[hsl(220_50%_55%/0.20)]',
  [SearchEntityType.VaultFile]:
    'bg-[hsl(220_50%_55%/0.12)] text-[hsl(220_70%_70%)] hover:bg-[hsl(220_50%_55%/0.20)]',
  [SearchEntityType.VaultFolder]:
    'bg-[hsl(220_50%_55%/0.12)] text-[hsl(220_70%_70%)] hover:bg-[hsl(220_50%_55%/0.20)]',

  // Tasks — muted amber
  [SearchEntityType.Issue]:
    'bg-[hsl(38_70%_50%/0.12)] text-[hsl(38_80%_65%)] hover:bg-[hsl(38_70%_50%/0.20)]',

  // Canvases — muted teal
  [SearchEntityType.Whiteboard]:
    'bg-[hsl(168_50%_45%/0.12)] text-[hsl(168_60%_60%)] hover:bg-[hsl(168_50%_45%/0.20)]',

  // People — muted violet
  [SearchEntityType.User]:
    'bg-[hsl(265_50%_60%/0.12)] text-[hsl(265_70%_72%)] hover:bg-[hsl(265_50%_60%/0.20)]',
}

const DEFAULT_COLOR = 'bg-white/5 text-secondary hover:bg-white/10'

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
      className={`mention-chip inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug transition-colors duration-100 select-none cursor-pointer ${colorClass}`}
      onClick={handleClick}
      title={isOrphaned ? 'This entity no longer exists' : `${entityType}: ${displayText}`}
    >
      <span aria-hidden="true">@</span>
      <span>{displayText || entityId}</span>
    </span>
  )
}
