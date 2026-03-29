/**
 * Reaction Merge Logic
 *
 * Pure functions for applying reaction add/remove deltas to a local
 * ReactionGroup array. Used by both:
 *  - WS event handlers (server-driven updates)
 *  - Optimistic UI patches (before server ACK)
 *
 * Both paths use the same function, guaranteeing consistency between
 * optimistic state and server-confirmed state.
 */
import type { ReactionGroup } from '../model/schema'

/**
 * Merge a reaction-added event into the current reactions array.
 * Idempotent: if userId is already in authorIds for this emoji, returns
 * the array unchanged (dedup guard against double-broadcast).
 */
export function mergeReactionAdd(
  current: Array<ReactionGroup>,
  emoji: string,
  userId: string,
  currentUserId: string,
): Array<ReactionGroup> {
  const existing = current.find((r) => r.emoji === emoji)

  if (existing) {
    // Dedup guard: same userId cannot be counted twice.
    // Check authorIds first (populated after first reaction event),
    // then fall back to hasReacted (set from server-loaded data).
    const alreadyReacted =
      existing.authorIds != null
        ? existing.authorIds.includes(userId)
        : userId === currentUserId && existing.hasReacted
    if (alreadyReacted) return current

    return current.map((r) =>
      r.emoji === emoji
        ? {
            ...r,
            count: r.count + 1,
            hasReacted: r.hasReacted || userId === currentUserId,
            authorIds: [...(r.authorIds ?? []), userId],
          }
        : r,
    )
  }

  // New emoji on this message
  return [
    ...current,
    {
      emoji,
      count: 1,
      hasReacted: userId === currentUserId,
      authorIds: [userId],
    },
  ]
}

/**
 * Merge a reaction-removed event into the current reactions array.
 * Removes the emoji group entirely when count reaches 0.
 */
export function mergeReactionRemove(
  current: Array<ReactionGroup>,
  emoji: string,
  userId: string,
  currentUserId: string,
): Array<ReactionGroup> {
  return current
    .map((r) => {
      if (r.emoji !== emoji) return r

      // Presence guard: only remove/decrement if userId is confirmed in the list.
      // This prevents the double-decrement caused by optimistic patch + server echo:
      //   - If authorIds exists, check membership directly.
      //   - If authorIds absent (server-loaded data), only remove for currentUser
      //     when hasReacted is true.
      const confirmedPresent =
        r.authorIds != null
          ? r.authorIds.includes(userId)
          : userId === currentUserId && r.hasReacted

      if (!confirmedPresent) return r

      return {
        ...r,
        count: Math.max(0, r.count - 1),
        hasReacted: r.hasReacted && userId !== currentUserId,
        authorIds: (r.authorIds ?? []).filter((id) => id !== userId),
      }
    })
    .filter((r) => r.count > 0)
}
