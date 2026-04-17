import { forwardRef } from 'react'
import type { SearchEntity, SearchEntityType } from '@/gql/graphql'
import type { SearchResult } from '../lib'

interface EntityPickerProps {
  results: Array<SearchResult>
  isLoading: boolean
  onSelect: (entity: SearchEntity) => void
  renderItem?: (result: SearchResult, onClick: () => void) => React.ReactNode
  emptyMessage?: string
}

const ENTITY_ICONS: Record<SearchEntityType, string> = {
  PAGE: '📄',
  ISSUE: '🐛',
  VAULT_FILE: '📎',
  VAULT_FOLDER: '📁',
  WHITEBOARD: '🎨',
  USER: '👤',
}

export const EntityPicker = forwardRef<HTMLDivElement, EntityPickerProps>(
  ({ results, isLoading, onSelect, renderItem, emptyMessage = 'No results found' }, ref) => {
    if (isLoading) {
      return (
        <div ref={ref} className="entity-picker">
          <div className="entity-picker__loading">Loading...</div>
        </div>
      )
    }

    if (results.length === 0) {
      return (
        <div ref={ref} className="entity-picker">
          <div className="entity-picker__empty">{emptyMessage}</div>
        </div>
      )
    }

    return (
      <div ref={ref} className="entity-picker">
        {results.map((result) => {
          const icon = ENTITY_ICONS[result.item.type]

          if (renderItem) {
            return renderItem(result, () => onSelect(result.item))
          }

          return (
            <button
              key={`${result.item.type}-${result.item.id}`}
              className="entity-picker__item"
              onClick={() => onSelect(result.item)}
              type="button"
            >
              <span className="entity-picker__icon">{icon}</span>
              <span className="entity-picker__name">{result.item.name}</span>
              <span className="entity-picker__type">{result.item.type}</span>
            </button>
          )
        })}
      </div>
    )
  }
)

EntityPicker.displayName = 'EntityPicker'
