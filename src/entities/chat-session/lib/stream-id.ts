/**
 * Compares two Redis Stream IDs.
 * Format: "timestamp-sequence" (e.g., "169000000000-0")
 *
 * Returns:
 * - Negative if id1 < id2
 * - Zero if id1 == id2
 * - Positive if id1 > id2
 */
export function compareStreamId(
  id1: string | null,
  id2: string | null,
): number {
  if (!id1 && !id2) return 0
  if (!id1) return -1 // null is older than anything
  if (!id2) return 1

  const [ts1, seq1] = id1.split('-').map(Number)
  const [ts2, seq2] = id2.split('-').map(Number)

  if (ts1 !== ts2) {
    return ts1 - ts2
  }
  return seq1 - seq2
}

/**
 * Parses a stream ID into its components
 */
export function parseStreamId(id: string) {
  const [ts, seq] = id.split('-').map(Number)
  return { ts, seq }
}
