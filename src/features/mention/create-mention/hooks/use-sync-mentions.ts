/**
 * use-sync-mentions — subscribes to editor changes and syncs mention chips
 * with the backend on a debounced schedule.
 *
 * Strategy — Replace on any removal:
 *   - If only NEW chips appear: call createMentions for the additions only.
 *   - If any chips were REMOVED: call deleteMentionsBySource (wipes all for
 *     this source) then createMentions for ALL current chips. This avoids
 *     complex diffing while remaining correct.
 *
 * Debounce is set to 1.5 s — comfortable for active editing without spamming
 * the network on every keystroke.
 *
 * Usage (inside an editor component's useEffect or onChange handler):
 *
 *   const syncMentions = useSyncMentions({
 *     sourceEntityId:   pageId,
 *     sourceEntityType: 'PAGE',
 *     editor,
 *   })
 *
 *   useEffect(() => {
 *     return editor.onChange(() => {
 *       syncMentions()   // debounced internally
 *     })
 *   }, [editor, syncMentions])
 *
 * @layer Features → mention/create-mention/hooks
 */
import { useCallback, useEffect, useRef } from 'react'
import type { MentionEditor } from '../../lib/mention-schema'
import type { CreateMentionInput } from '@/gql/graphql'
import { extractMentionChips, type MentionChipData } from '../../lib/extract-mention-chips'
import { useCreateMentions } from './use-create-mention'
import { useDeleteMentionsBySource } from '../../delete-mention-by-source'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SyncMentionsOptions {
  /** Backend ID of the entity that contains the editor (e.g. pageId, issueId) */
  sourceEntityId: string
  /** Entity type of the source (e.g. "PAGE", "ISSUE") */
  sourceEntityType: string
  /** The BlockNote editor instance */
  editor: MentionEditor
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Returns a debounced sync callback. Call it inside `editor.onChange`.
 * Stable reference — safe to pass as a dependency to useEffect.
 */
export function useSyncMentions({
  sourceEntityId,
  sourceEntityType,
  editor,
}: SyncMentionsOptions): () => void {
  const createMentions        = useCreateMentions()
  const deleteMentionsBySource = useDeleteMentionsBySource()

  const prevChipsRef = useRef<MentionChipData[]>([])
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      const currentChips = extractMentionChips(editor.document)
      const prevChips    = prevChipsRef.current

      // Fast exit — nothing changed
      if (
        currentChips.length === prevChips.length &&
        currentChips.every((c, i) =>
          c.entityId === prevChips[i]?.entityId &&
          c.blockId  === prevChips[i]?.blockId,
        )
      ) {
        return
      }

      prevChipsRef.current = currentChips

      const prevIds    = new Set(prevChips.map((c) => `${c.blockId}:${c.entityId}`))
      const currentIds = new Set(currentChips.map((c) => `${c.blockId}:${c.entityId}`))

      const added   = currentChips.filter((c) => !prevIds.has(`${c.blockId}:${c.entityId}`))
      const anyRemoved = prevChips.some((c) => !currentIds.has(`${c.blockId}:${c.entityId}`))

      if (anyRemoved) {
        // Replace strategy: wipe all then re-create survivors
        try {
          await deleteMentionsBySource.mutateAsync(sourceEntityId)

          if (currentChips.length > 0) {
            // USER mentions are Tier 1 (notification only) — no backlink records.
            // Clerk user IDs (user_XXXX) also fail CUID validation on the server.
            const entityChips = currentChips.filter((c) => c.entityType !== 'USER')
            if (entityChips.length > 0) {
              const mentionInputs = entityChips.map<CreateMentionInput>((chip) => ({
                sourceEntityId,
                sourceEntityType,
                targetEntityId:   chip.entityId,
                targetEntityType: chip.entityType,
                displayText:      chip.displayText,
                sourceLocation:   { blockId: chip.blockId, fieldName: 'content' },
              }))
              await createMentions.mutateAsync(mentionInputs)
            }
          }
        } catch {
          // Non-critical — mention sync failure should not surface to user
          // Next onChange will retry
        }
        return
      }

      if (added.length > 0) {
        // Additive-only: just create the new entity mentions (skip USER)
        const entityAdded = added.filter((c) => c.entityType !== 'USER')
        if (entityAdded.length > 0) {
          const mentionInputs = entityAdded.map<CreateMentionInput>((chip) => ({
            sourceEntityId,
            sourceEntityType,
            targetEntityId:   chip.entityId,
            targetEntityType: chip.entityType,
            displayText:      chip.displayText,
            sourceLocation:   { blockId: chip.blockId, fieldName: 'content' },
          }))
          try {
            await createMentions.mutateAsync(mentionInputs)
          } catch {
            // Non-critical — retry on next change
          }
        }
      }
    }, 1_500)
  // Editor reference is stable per mount; source IDs shouldn't change mid-life
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceEntityId, sourceEntityType, editor])
}
