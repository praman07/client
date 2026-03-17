/**
 * description-helpers — Utilities for BlockNote description handling
 * in the create-issue feature.
 *
 * @layer Features
 */

/**
 * Returns true if the BlockNote document is effectively empty.
 * BlockNote initialises with a single empty paragraph — that counts as empty.
 */
 
export function isDescriptionEmpty(blocks: Array<any>): boolean {
  if (!blocks || blocks.length === 0) return true
  if (blocks.length === 1) {
    const b = blocks[0]
    // A single paragraph with no content array or an empty one
    if (b.type === 'paragraph') {
      return !b.content || b.content.length === 0
    }
  }
  return false
}
