/**
 * MentionSuggestionMenu — custom @-mention menu styled identically to the
 * slash menu ("Obsidian Architect" design system).
 *
 * Reuses the `csm-*` CSS classes from editor.css for the panel, items, and
 * footer. Adds `cmm-tabs` for the category filter row.
 *
 * @layer Features → mention/ui
 */
import { useEffect, useRef } from 'react'
import type { DefaultReactSuggestionItem } from '@blocknote/react'
import { SearchEntityType } from '@/gql/graphql'
// Side-effect import: makes csm-* + cmm-* styles available for all editors
import '@/widgets/page-editor/ui/editor.css'

// ── Category tabs config ──────────────────────────────────────────────────────

export type TabFilter = 'ALL' | SearchEntityType

interface TabConfig {
  key: TabFilter
  label: string
}

const TABS: TabConfig[] = [
  { key: 'ALL',                       label: 'All'         },
  { key: SearchEntityType.User,       label: 'People'      },
  { key: SearchEntityType.Page,       label: 'Pages'       },
  { key: SearchEntityType.Issue,      label: 'Issues'      },
  { key: SearchEntityType.VaultFile,  label: 'Files'       },
  { key: SearchEntityType.Whiteboard, label: 'Boards'      },
]

// ── Props ─────────────────────────────────────────────────────────────────────

// We do NOT extend BlockNote's SuggestionMenuProps here because that type
// carries required internal fields (e.g. loadingState) that don't apply when
// the menu is used outside a BlockNote editor (e.g. ChatMentionTrigger).
// MentionMenuController passes a compatible superset via spread {...props}.
interface MentionSuggestionMenuProps {
  items: DefaultReactSuggestionItem[]
  selectedIndex: number | null | undefined
  onItemClick?: (item: DefaultReactSuggestionItem) => void
  activeTab: TabFilter
  onTabChange: (tab: TabFilter) => void
  /** Entity types that exist in the project — only these tabs render */
  availableTypes: Set<string>
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MentionSuggestionMenu({
  items,
  selectedIndex,
  onItemClick,
  activeTab,
  onTabChange,
  availableTypes,
}: MentionSuggestionMenuProps) {

  // Track which groups have already had their label rendered (reset each render)
  const seenGroups = new Set<string>()

  // Only render tabs for entity types that actually exist in this project
  const visibleTabs = TABS.filter(
    (tab) => tab.key === 'ALL' || availableTypes.has(tab.key)
  )

  return (
    <div role="listbox" className="csm-root cmm-root">

      {/* ── Category tabs ────────────────────────────────────────── */}
      <div className="cmm-tabs" role="tablist" aria-label="Filter by type">
        {visibleTabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.key}
            className={`cmm-tab${activeTab === tab.key ? ' cmm-tab--active' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault() // keep editor focus
              onTabChange(tab.key)
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div className="cmm-divider" aria-hidden="true" />

      {/* ── Results list ─────────────────────────────────────────── */}
      <div className="cmm-results">
        {items.length === 0 ? (
          <div className="csm-empty">No results</div>
        ) : (
          <div className="csm-list">
            {items.map((item, index) => {
              const isSelected = index === selectedIndex
              const group = item.group ?? ''
              const showGroupLabel = group !== '' && !seenGroups.has(group)
              if (showGroupLabel) seenGroups.add(group)

              return (
                <div key={`${group}__${item.title}__${index}`}>
                  {showGroupLabel && (
                    <div className="csm-group-label" aria-hidden="true">
                      {group}
                    </div>
                  )}
                  <MentionItem
                    item={item}
                    isSelected={isSelected}
                    onClick={() => onItemClick?.(item)}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <div className="csm-footer" aria-hidden="true">
        <span className="csm-footer__label">Mention entity</span>
        <span className="csm-footer__badge">esc</span>
      </div>
    </div>
  )
}

// ── MentionItem ───────────────────────────────────────────────────────────────

interface MentionItemProps {
  item: DefaultReactSuggestionItem
  isSelected: boolean
  onClick: () => void
}

function MentionItem({ item, isSelected, onClick }: MentionItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isSelected || !ref.current) return
    ref.current.scrollIntoView({ block: 'nearest', behavior: 'instant' })
  }, [isSelected])

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      data-selected={isSelected ? '' : undefined}
      className="csm-item"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {item.icon && (
        <div className="csm-item__icon" aria-hidden="true">
          {item.icon}
        </div>
      )}
      <div className="csm-item__body">
        <span className="csm-item__title">{item.title}</span>
      </div>
      {item.badge && (
        <span className="csm-item__badge" aria-hidden="true">
          {item.badge}
        </span>
      )}
    </div>
  )
}
