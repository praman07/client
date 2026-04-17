/**
 * ENTITY_META — shared label + icon map for all taggable entity types.
 *
 * Used by:
 *   - MentionMenuController (BlockNote suggestion menu)
 *   - ChatMentionTrigger (chat input suggestion menu)
 *
 * @layer Features → mention/lib
 */

export interface EntityMeta {
  label: string
  icon: string
}

export const ENTITY_META: Record<string, EntityMeta> = {
  USER:         { label: 'People',      icon: '👤' },
  PAGE:         { label: 'Pages',       icon: '📄' },
  ISSUE:        { label: 'Issues',      icon: '🐛' },
  VAULT_FILE:   { label: 'Files',       icon: '📎' },
  VAULT_FOLDER: { label: 'Folders',     icon: '📁' },
  WHITEBOARD:   { label: 'Whiteboards', icon: '🎨' },
}
