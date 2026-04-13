import { useEffect, useRef } from 'react'
import type {DefaultReactSuggestionItem, SuggestionMenuProps} from '@blocknote/react';

/**
 * CollabifySlashMenu — custom slash menu matching the "Obsidian Architect" design system.
 *
 * Layout per reference image:
 *   [28px icon box] [title · subtext?]   [badge]
 * Grouped by `item.group` with a section label above each group.
 * A "Close menu" footer is appended.
 *
 * Position, visibility, keyboard navigation, and filtering are handled entirely
 * by BlockNote's SuggestionMenuController — this component only handles rendering.
 *
 * @layer Widgets/page-editor
 */
export function NotionSlashMenu(
  props: SuggestionMenuProps<DefaultReactSuggestionItem>,
) {
  const { items, selectedIndex, onItemClick } = props

  // Track which groups have already had their label rendered (reset each render)
  const seenGroups = new Set<string>()

  if (items.length === 0) {
    return (
      <div role="listbox" className="csm-root">
        <div className="csm-empty">No results</div>
      </div>
    )
  }

  return (
    <div role="listbox" className="csm-root">
      <div className="csm-list">
        {items.map((item, index) => {
          const isSelected = index === selectedIndex
          const group = item.group ?? ''
          const showGroupLabel = group !== '' && !seenGroups.has(group)
          if (showGroupLabel) seenGroups.add(group)

          return (
            <div key={`${group}__${item.title}`}>
              {showGroupLabel && (
                <div className="csm-group-label" aria-hidden="true">
                  {group}
                </div>
              )}
              <SlashItem
                item={item}
                isSelected={isSelected}
                onClick={() => onItemClick?.(item)}
              />
            </div>
          )
        })}
      </div>

      {/* Footer close-menu hint — matches reference image */}
      <div className="csm-footer" aria-hidden="true">
        <span className="csm-footer__label">Close menu</span>
        <span className="csm-footer__badge">esc</span>
      </div>
    </div>
  )
}

// ─── SlashItem ────────────────────────────────────────────────────────────────

interface SlashItemProps {
  item: DefaultReactSuggestionItem
  isSelected: boolean
  onClick: () => void
}

function SlashItem({ item, isSelected, onClick }: SlashItemProps) {
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
      {/* Left: icon box */}
      {item.icon && (
        <div className="csm-item__icon" aria-hidden="true">
          {item.icon}
        </div>
      )}

      {/* Centre: title only */}
      <div className="csm-item__body">
        <span className="csm-item__title">{item.title}</span>
      </div>

      {/* Right: keyboard badge (e.g. #, ##, ###) */}
      {item.badge && (
        <span className="csm-item__badge" aria-hidden="true">
          {item.badge}
        </span>
      )}
    </div>
  )
}
