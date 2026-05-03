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
        <div
          ref={ref}
          className="bg-surface-2 border border-subtle rounded-lg p-4 text-center"
        >
          <div className="text-13 text-secondary">Loading...</div>
        </div>
      )
    }

    if (results.length === 0) {
      return (
        <div
          ref={ref}
          className="bg-surface-2 border border-subtle rounded-lg p-4 text-center"
        >
          <div className="text-13 text-tertiary">{emptyMessage}</div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className="bg-surface-2 border border-subtle rounded-lg overflow-hidden flex flex-col"
      >
        {results.map((result) => {
          const icon = ENTITY_ICONS[result.item.type]

          if (renderItem) {
            return renderItem(result, () => onSelect(result.item))
          }

          return (
            <button
              key={`${result.item.type}-${result.item.id}`}
              className="flex items-center gap-3 px-3 py-2 text-left text-13 text-primary hover:bg-layer-1-hover transition-colors duration-100 border-b border-subtle last:border-b-0"
              onClick={() => onSelect(result.item)}
              type="button"
            >
              <span className="text-14">{icon}</span>
              <span className="flex-1 truncate text-primary">{result.item.name}</span>
              <span className="text-11 text-tertiary uppercase">{result.item.type}</span>
            </button>
          )
        })}
      </div>
    )
  }
)

EntityPicker.displayName = 'EntityPicker'
