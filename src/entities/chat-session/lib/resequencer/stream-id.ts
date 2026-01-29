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
 * Checks if candidateId is strictly the next ID after currentId.
 * Logic:
 * 1. Same Timestamp AND Sequence + 1
 * 2. Note: If timestamp increases, we CANNOT strictly know if it's next (could be gap).
 *    So we return false for timestamp jumps to force buffering (Safe Mode).
 */
export function isStrictlyNextStreamId(
  currentId: string | null,
  candidateId: string,
): boolean {
  if (!currentId) return false // Cold start always buffers/desyncs or handled separately
  const [ts1, seq1] = currentId.split('-').map(Number)
  const [ts2, seq2] = candidateId.split('-').map(Number)

  if (ts1 === ts2 && seq2 === seq1 + 1) {
    return true
  }
  return false
}

/**
 * Parses a stream ID into its components (Unsafe - assumes valid input)
 */
export function parseStreamId(id: string) {
  const [ts, seq] = id.split('-').map(Number)
  return { ts, seq }
}

/**
 * Validates if the string is a conformant Redis Stream ID
 * Format: <timestamp>-<sequence> (e.g. 1690000000000-0)
 */
export function isValidStreamId(id: string | null): boolean {
  if (!id) return false
  // Regex: 1+ digits, hyphen, 1+ digits
  return /^\d+-\d+$/.test(id)
}

/**
 * Safely parses a stream ID, throwing or returning null on failure.
 * Used at integration boundaries (Network/Storage).
 */
export function safeParseStreamId(id: unknown): string | null {
  if (typeof id !== 'string') return null
  if (!isValidStreamId(id)) {
    console.warn(`[StreamID] Invalid format: ${id}`)
    return null
  }
  return id
}
