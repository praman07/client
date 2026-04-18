/**
 * MentionMenuController — mounts the @-mention suggestion system inside
 * a BlockNote editor.
 *
 * Usage: place inside <BlockNoteView> as a child:
 *
 *   <BlockNoteView editor={editor}>
 *     <SuggestionMenuController triggerCharacter="/" ... />
 *     <MentionMenuController projectId={project.id} />
 *   </BlockNoteView>
 *
 * Pattern mirrors the official BlockNote mentions example:
 *   - `editor` is obtained via `useBlockNoteEditor()` (editor context)
 *   - `getItems` is defined inline so it closes over `editor` directly
 *   - Uses `DefaultReactSuggestionItem` (BlockNote's standard item type)
 *   - Category tab state is held in a `useRef` so the `getItems` closure
 *     always reads the current filter without becoming stale
 *
 * @layer Features → mention/ui
 */
import { useCallback, useMemo, useRef, useState } from 'react'
import {
  
  SuggestionMenuController,
  
  useBlockNoteEditor
} from '@blocknote/react'
import { useProjectEntities } from '../fetch-entities'
import { searchEntities } from '../lib'
import { ENTITY_META } from '../lib/entity-meta'
import { MentionSuggestionMenu } from './MentionSuggestionMenu'
import type {DefaultReactSuggestionItem, SuggestionMenuProps} from '@blocknote/react';

import type { SearchEntityType } from '@/gql/graphql'

// ── Types ─────────────────────────────────────────────────────────────────────

type TabFilter = 'ALL' | SearchEntityType

interface MentionMenuControllerProps {
  projectId: string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MentionMenuController({ projectId }: MentionMenuControllerProps) {
  // `useBlockNoteEditor` accesses the editor via React context.
  // We type as `any` — we only use `insertInlineContent` which is untyped-safe.
   
  const editor = useBlockNoteEditor<any, any, any>()

  const { data: entities } = useProjectEntities(projectId)

  // Compute which entity types actually exist in this project.
  // Used to show only relevant tabs in the suggestion menu.
  const availableTypes = useMemo(() => {
    const types = new Set<string>()
    if (entities) {
      for (const e of entities) types.add(e.type)
    }
    return types
  }, [entities])

  // Active category filter — ref so getItems closure reads current value without
  // going stale; also state so the menu UI re-renders on tab change.
  const activeTypeFilterRef = useRef<TabFilter>('ALL')
  const [activeTab, setActiveTab] = useState<TabFilter>('ALL')

  // Version bump forces SuggestionMenuController to re-call getItems after a
  // tab change (otherwise it only re-calls on query change).
  const [filterVersion, setFilterVersion] = useState(0)

  const handleTabChange = useCallback((tab: TabFilter) => {
    activeTypeFilterRef.current = tab
    setActiveTab(tab)
    setFilterVersion((v) => v + 1)
  }, [])

  // Inline getItems — mirrors the official BlockNote example.
  // Async to satisfy the API contract; all filtering is synchronous.
  const getItems = useCallback(
    async (query: string): Promise<Array<DefaultReactSuggestionItem>> => {
      if (!entities || entities.length === 0) return []

      const filter = activeTypeFilterRef.current
      const isActiveSearch = query.trim().length > 0

      let pool: typeof entities

      if (isActiveSearch) {
        // Searching: rank by relevance, no per-type cap needed
        const results = searchEntities(entities, query, 100)
        pool = results
          .filter((r) => filter === 'ALL' || r.item.type === filter)
          .map((r) => r.item)
      } else if (filter !== 'ALL') {
        // Empty query + specific tab: show all of that type (up to 50)
        pool = entities.filter((e) => e.type === filter).slice(0, 50)
      } else {
        // Empty query + ALL tab: take up to 8 per entity type so every
        // category appears even if one type has hundreds of records
        const PER_TYPE = 8
        const countByType = new Map<string, number>()
        pool = []
        for (const entity of entities) {
          const count = countByType.get(entity.type) ?? 0
          if (count < PER_TYPE) {
            pool.push(entity)
            countByType.set(entity.type, count + 1)
          }
        }
      }

      return pool.map((entity) => {
        const meta = ENTITY_META[entity.type] ?? { label: entity.type, icon: '🔗' }
        return {
          title: entity.name,
          group: meta.label,
          icon: <span aria-hidden="true">{meta.icon}</span>,
          onItemClick: () => {
            editor.insertInlineContent([
              {
                type: 'mention',
                props: {
                  entityId:    entity.id,
                  entityType:  entity.type,
                  displayText: entity.name,
                },
              },
              ' ', // space after chip so cursor lands outside
            ])
          },
        }
      })
    },
    // Re-run when entity cache refreshes (staleTime 5min) or tab changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entities, editor, filterVersion],
  )


  // Bound wrapper injects activeTab + onTabChange + availableTypes into the menu.
  const BoundMentionMenu = useCallback(
    (props: SuggestionMenuProps<DefaultReactSuggestionItem>) => (
      <MentionSuggestionMenu
        {...props}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        availableTypes={availableTypes}
      />
    ),
    [activeTab, handleTabChange, availableTypes],
  )

  return (
    <SuggestionMenuController
      triggerCharacter="@"
      getItems={getItems}
      suggestionMenuComponent={BoundMentionMenu}
    />
  )
}
