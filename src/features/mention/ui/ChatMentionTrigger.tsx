/**
 * ChatMentionTrigger — @-mention popup controller for the plain-text chat input.
 *
 * Architecture:
 *   - Trigger detection is driven by the `content` React prop (not DOM events),
 *     eliminating stale-closure bugs that plagued the original native-event approach.
 *   - Caret position is read once on input/keydown via a stable textarea ref.
 *   - `onMenuOpen` callback lets MessageInput block Enter-to-send while menu is open.
 *   - Keyboard navigation (↑↓ Enter Escape) is handled here via `onKeyDown` prop
 *     which MessageInput wires to the textarea, so there's only ONE keydown handler.
 *
 * @layer Features → mention/ui
 */
import {
  
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useProjectEntities } from '../fetch-entities'
import { searchEntities } from '../lib/search-engine'
import { ENTITY_META } from '../lib/entity-meta'
import { MentionSuggestionMenu  } from './MentionSuggestionMenu'
import type {RefObject} from 'react';
import type {TabFilter} from './MentionSuggestionMenu';
import type { DefaultReactSuggestionItem } from '@blocknote/react'
import type { MentionRef } from '@/widgets/chat-window/ui/components/RichChatContent'

interface TriggerState {
  active:    boolean
  query:     string
  /** Offset of the `@` character in the textarea value */
  atOffset:  number
}

export interface ChatMentionTriggerProps {
  projectId:         string
  content:           string
  onContentChange:   (next: string) => void
  mentions:          Array<MentionRef>
  onMentionsChange:  (next: Array<MentionRef>) => void
  /** Ref to the textarea — used to read & set caret position */
  inputRef:          RefObject<HTMLTextAreaElement | null>
  /** Called whenever the menu opens or closes */
  onMenuOpen:        (isOpen: boolean) => void
}

// ── Trigger detection ─────────────────────────────────────────────────────────

/**
 * Scans backwards from `caretPos` in `value` to find the nearest `@` that:
 *   - Is at start of string OR preceded by whitespace
 *   - Has no whitespace between itself and the caret (query portion)
 *
 * Returns { atOffset, query } or null if no active trigger.
 */
function detectTrigger(
  value: string,
  caretPos: number,
): { atOffset: number; query: string } | null {
  const textBeforeCaret = value.slice(0, caretPos)
  const lastAt = textBeforeCaret.lastIndexOf('@')
  if (lastAt === -1) return null

  const query = textBeforeCaret.slice(lastAt + 1)       // text between @ and caret
  if (/\s/.test(query)) return null                      // whitespace → closed

  const charBefore = lastAt > 0 ? textBeforeCaret[lastAt - 1] : ' '
  if (!/[\s]/.test(charBefore)) return null              // @ must follow whitespace

  return { atOffset: lastAt, query }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ChatMentionTrigger({
  projectId,
  content,
  onContentChange,
  mentions,
  onMentionsChange,
  inputRef,
  onMenuOpen,
}: ChatMentionTriggerProps) {
  const { data: entities } = useProjectEntities(projectId)

  const [trigger, setTrigger] = useState<TriggerState>({
    active:   false,
    query:    '',
    atOffset: 0,
  })
  const [activeTab, setActiveTab]         = useState<TabFilter>('ALL')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Keep latest trigger in a ref so keyboard handler closures don't go stale
  const triggerRef    = useRef(trigger)
  const contentRef    = useRef(content)
  const mentionsRef   = useRef(mentions)
  const activeTabRef  = useRef<TabFilter>('ALL')

  useEffect(() => { triggerRef.current   = trigger   }, [trigger])
  useEffect(() => { contentRef.current   = content   }, [content])
  useEffect(() => { mentionsRef.current  = mentions  }, [mentions])

  // ── Notify parent when menu open state changes ────────────────────────────

  useEffect(() => {
    onMenuOpen(trigger.active)
  }, [trigger.active, onMenuOpen])

  // ── Tab change ────────────────────────────────────────────────────────────

  const handleTabChange = useCallback((tab: TabFilter) => {
    activeTabRef.current = tab
    setActiveTab(tab)
    setSelectedIndex(0)
  }, [])

  // ── Insert selected mention ───────────────────────────────────────────────

  const insertMention = useCallback(
    (entityId: string, entityType: string, displayText: string) => {
      const { atOffset, query } = triggerRef.current
      const current = contentRef.current

      // Replace `@query` with `@displayText ` in the textarea value
      const before   = current.slice(0, atOffset)
      const after    = current.slice(atOffset + 1 + query.length)
      const token    = `@${displayText} `
      const next     = `${before}${token}${after}`

      onContentChange(next)
      onMentionsChange([
        ...mentionsRef.current,
        {
          entityId,
          entityType,
          displayText,
          offset: atOffset,        // character offset of the @ in the final string
        },
      ])

      // Reset menu state
      setTrigger({ active: false, query: '', atOffset: 0 })
      setActiveTab('ALL')
      activeTabRef.current = 'ALL'
      setSelectedIndex(0)

      // Restore focus + place caret after the inserted token
      const textarea = inputRef.current
      if (textarea) {
        const caretNext = atOffset + token.length
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(caretNext, caretNext)
        }, 0)
      }
    },
    [onContentChange, onMentionsChange, inputRef],
  )

  // ── Suggestion items (React-state driven, no stale closures) ─────────────

  const items = useMemo((): Array<DefaultReactSuggestionItem> => {
    if (!trigger.active || !entities) return []

    const filter   = activeTabRef.current
    const isSearch = trigger.query.trim().length > 0

    let pool: typeof entities

    if (isSearch) {
      const results = searchEntities(entities, trigger.query, 100)
      pool = results
        .filter(r => filter === 'ALL' || r.item.type === filter)
        .map(r => r.item)
    } else if (filter !== 'ALL') {
      pool = entities.filter(e => e.type === filter).slice(0, 50)
    } else {
      const PER_TYPE = 8
      const seen = new Map<string, number>()
      pool = []
      for (const e of entities) {
        const c = seen.get(e.type) ?? 0
        if (c < PER_TYPE) { pool.push(e); seen.set(e.type, c + 1) }
      }
    }

    return pool.map(entity => {
      const meta = ENTITY_META[entity.type] ?? { label: entity.type, icon: '🔗' }
      return {
        title:       entity.name,
        group:       meta.label,
        icon:        <span aria-hidden="true">{meta.icon}</span>,
        onItemClick: () => insertMention(entity.id, entity.type, entity.name),
      }
    })
  // activeTab in deps so list rebuilds when tab changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entities, trigger.active, trigger.query, activeTab, insertMention])

  // Keep selectedIndex in bounds when items list changes
  useEffect(() => {
    setSelectedIndex(prev => Math.min(prev, Math.max(0, items.length - 1)))
  }, [items.length])

  // ── Available tabs ────────────────────────────────────────────────────────

  const availableTypes = useMemo(() => {
    const types = new Set<string>()
    if (entities) for (const e of entities) types.add(e.type)
    return types
  }, [entities])

  // ── Public keyboard handler — called by MessageInput's onKeyDown ──────────

  /**
   * Returns true if the event was consumed by the menu (caller should
   * e.preventDefault() and NOT process it further).
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>): boolean => {
      if (!triggerRef.current.active) return false

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, items.length - 1))
        return true
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
        return true
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        const selected = items[selectedIndex]
        if (selected) {
          e.preventDefault()
          selected.onItemClick?.()
          return true
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setTrigger({ active: false, query: '', atOffset: 0 })
        return true
      }
      return false
    },
    [items, selectedIndex],
  )

  // ── Expose handleKeyDown via ref so MessageInput can call it ─────────────

  // (See MessageInput — it calls triggerRef.current?.handleKeyDown(e))
  if (typeof (ChatMentionTrigger as unknown as { _ref?: unknown })._ref === 'undefined') {
    // no-op; ref forwarding done via callback prop below
  }

  // ── Public API exposed to parent via onKeyDown prop ───────────────────────
  // We expose this via a module-level ref trick; see MessageInput for usage.
  ChatMentionTrigger._keyHandler = handleKeyDown

  // ── Watch content changes to detect @-trigger ─────────────────────────────

  /**
   * Called by MessageInput's onChange. We read the current caret position
   * from the textarea ref (synchronous — fires during the same React render
   * cycle as the onChange, so selectionStart is still accurate).
   */
  const checkTrigger = useCallback(() => {
    const textarea = inputRef.current
    if (!textarea) return

    const found = detectTrigger(textarea.value, textarea.selectionStart ?? 0)
    if (found) {
      setTrigger(prev => {
        // Only reset selectedIndex if query actually changed
        const queryChanged = prev.query !== found.query || prev.atOffset !== found.atOffset
        if (queryChanged) setSelectedIndex(0)
        return { active: true, query: found.query, atOffset: found.atOffset }
      })
    } else {
      setTrigger(prev => prev.active ? { active: false, query: '', atOffset: 0 } : prev)
    }
  }, [inputRef])

  // Expose to MessageInput
  ChatMentionTrigger._checkTrigger = checkTrigger

  // ── Render ────────────────────────────────────────────────────────────────

  if (!trigger.active || items.length === 0) return null

return (
    <div
      className="absolute bottom-full left-0 right-0 mb-1 z-[var(--z-dropdown)]"
      onMouseDown={(e) => e.preventDefault()}   // prevent textarea blur on menu click
    >
      <MentionSuggestionMenu
        items={items}
        selectedIndex={selectedIndex}
        onItemClick={item => item.onItemClick?.()}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        availableTypes={availableTypes}
      />
    </div>
  )
}

// Module-level slots so MessageInput can call trigger methods without
// prop-drilling callbacks through multiple layers.
// This is intentionally minimal — the trigger is always mounted inside
// MessageInput so these are always fresh.
ChatMentionTrigger._keyHandler   = null as unknown as (e: React.KeyboardEvent<HTMLTextAreaElement>) => boolean
ChatMentionTrigger._checkTrigger = null as unknown as () => void
