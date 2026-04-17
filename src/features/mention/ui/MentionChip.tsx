/**
 * MentionChip — render component for the `mention` inline content spec.
 *
 * Passed as the `render` option to `createReactInlineContentSpec`. BlockNote
 * calls this with `{ inlineContent: { props: { entityId, entityType, displayText } } }`.
 *
 * `InlineContentComponentProps` is NOT exported from @blocknote/react — we
 * derive the prop shape from the spec's propSchema directly.
 *
 * @layer Features → mention/ui
 */
import { useNavigate } from '@tanstack/react-router'
import { SearchEntityType } from '@/gql/graphql'
import { buildEntityRoute } from '@/features/mention/lib/navigate-to-entity'

// ── Prop shape ────────────────────────────────────────────────────────────────

interface MentionChipProps {
  inlineContent: {
    props: {
      entityId: string
      entityType: string
      displayText: string
    }
  }
}

// ── Chip color map ────────────────────────────────────────────────────────────

const CHIP_COLORS: Record<string, string> = {
  [SearchEntityType.Page]:        'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  [SearchEntityType.Issue]:       'bg-amber-100 text-amber-700 hover:bg-amber-200',
  [SearchEntityType.VaultFile]:   'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  [SearchEntityType.VaultFolder]: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
  [SearchEntityType.Whiteboard]:  'bg-violet-100 text-violet-700 hover:bg-violet-200',
  [SearchEntityType.User]:        'bg-sky-100 text-sky-700 hover:bg-sky-200',
}

const DEFAULT_COLOR = 'bg-gray-100 text-gray-600 hover:bg-gray-200'

// ── Component ─────────────────────────────────────────────────────────────────

export function MentionChip({ inlineContent }: MentionChipProps) {
  const { entityId, entityType, displayText } = inlineContent.props
  const navigate = useNavigate()

  const isOrphaned = !entityId
  const colorClass = isOrphaned
    ? 'bg-red-50 text-red-400 line-through cursor-not-allowed'
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
      contentEditable={false}
      onClick={handleClick}
      title={isOrphaned ? 'This entity no longer exists' : `${entityType}: ${displayText}`}
    >
      <span aria-hidden="true">@</span>
      <span>{displayText || entityId}</span>
    </span>
  )
}
