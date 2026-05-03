/**
 * extract-mention-chips — walks a BlockNote document and collects all
 * `mention` inline content nodes.
 *
 * Used by `use-sync-mentions` to diff current vs previously synced chips
 * so the mutation layer knows what to create or delete on each change.
 *
 * @layer Features → mention/lib
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MentionChipData {
  /** Stable backend ID of the referenced entity. */
  entityId: string
  /** SearchEntityType string value (e.g. "PAGE", "ISSUE"). */
  entityType: string
  /** Display label at the time of insertion. */
  displayText: string
  /** BlockNote block ID — used as sourceLocation.blockId. */
  blockId: string
}

// ── Internal traversal ────────────────────────────────────────────────────────

function collectFromInlineContent(
   
  content: Array<any>,
  blockId: string,
  out: Array<MentionChipData>,
): void {
  for (const node of content) {
    // Type guard: only custom inline content nodes have a `props` object.
    // StyledText and Link have `text`/`href` instead.
    if (node.type === 'mention' && node.props) {
      const { entityId, entityType, displayText } = node.props as {
        entityId: string
        entityType: string
        displayText: string
      }
      if (entityId && entityType) {
        out.push({
          entityId,
          entityType,
          displayText: displayText || entityId,
          blockId,
        })
      }
    }
  }
}

 
function collectFromBlock(block: any, out: Array<MentionChipData>): void {
  if (Array.isArray(block.content)) {
    collectFromInlineContent(block.content, block.id as string, out)
  }
  if (Array.isArray(block.children)) {
    for (const child of block.children) {
      collectFromBlock(child, out)
    }
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Walk an entire BlockNote document and return all mention chips found.
 * Deduplicates by (blockId, entityId).
 */
 
export function extractMentionChips(document: Array<any>): Array<MentionChipData> {
  const out: Array<MentionChipData> = []
  for (const block of document) {
    collectFromBlock(block, out)
  }

  const seen = new Set<string>()
  return out.filter((chip) => {
    const key = `${chip.blockId}:${chip.entityId}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
