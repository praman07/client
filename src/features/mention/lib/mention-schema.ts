/**
 * mention-schema — custom BlockNote schema with the `mention` inline content spec.
 *
 * Lives in `features/mention/lib` so it can legally import `MentionChip`
 * from the same feature's UI layer (no shared→feature layer violation).
 *
 * Import path for consumers:
 *   import { mentionSchema } from '@/features/mention'
 *
 * @layer Features → mention/lib
 */
import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
} from '@blocknote/core'
import { createReactInlineContentSpec } from '@blocknote/react'
import { MentionChip } from '../ui/MentionChip'

// ── Inline content spec ───────────────────────────────────────────────────────

export const MentionSpec = createReactInlineContentSpec(
  {
    type: 'mention' as const,
    propSchema: {
      entityId:    { default: '' },
      entityType:  { default: '' },
      displayText: { default: '' },
    },
    content: 'none',
  },
  {
    render: MentionChip,
  },
)

// ── Schema ────────────────────────────────────────────────────────────────────

export const mentionSchema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mention: MentionSpec,
  },
})

// ── Type alias ────────────────────────────────────────────────────────────────

/**
 * Typed alias for a BlockNote editor instance that supports the `mention` spec.
 * Use `typeof mentionSchema.BlockNoteEditor` for fully-typed access.
 * Use `BlockNoteEditor<any, any, any>` for refs that cross layer boundaries.
 */
export type MentionEditor = typeof mentionSchema.BlockNoteEditor
