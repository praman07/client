import { Message } from '@/entities/message/model/types'
import { ChannelSessionState } from '../model/types'
import { compareStreamId } from './stream-id'

/**
 * Pure function to handle incoming message ordering.
 * Returns the *changes* to be applied to the state.
 */
export function resequenceMessage(
  state: ChannelSessionState,
  msg: Message,
): Partial<ChannelSessionState> {
  const currentExpected = state.expectedStreamId
  const msgStreamId = msg.streamId

  if (!msgStreamId) {
    // If message has no streamId (optimistic), we can't sequence it.
    // It is handled by the Feature layer (UI appending), not Session logic.
    return {}
  }

  // 1. Initial State Handling (First message ever)
  if (currentExpected === null) {
    // If we have no expectation, we accept the first message we see and set expectation to next.
    // In a real app, 'hydrate' would set the initial expectation.
    // This is a fallback or cold-start scenario.
    return {
      lastAppliedMessageId: msg.id,
      // We can't strictly know the next ID without a protocol,
      // but typically we wait for the next sequential one.
      // For now, we assume this sets the baseline.
      expectedStreamId: msgStreamId,
      status: 'IN_SYNC',
    }
  }

  const comparison = compareStreamId(msgStreamId, currentExpected)

  // 2. DUPLICATE / OLD CHECK
  if (comparison < 0) {
    // Message is older than expected. Drop it.
    return {}
  }

  // 3. HAPPY PATH (Exact Match)
  if (comparison === 0) {
    // Apply this message
    // Note: The caller (Redux Slice) is responsible for actually "saving" the message to the store/UI list
    // The Session Entity only tracks the *metadata* of ordering.

    // We need to calculate the *next* expected ID.
    // Since we don't know the implementation of "nextStreamId" here without complex Redis logic,
    // we rely on the server validation or we simply increment the sequence if possible,
    // OR more robustly: we wait for the NEXT message to fill the gap.

    // Actually, in the spec: "Last successfully applied message".
    // We update the applied ID. The *expectation* is usually "ID > this".

    // Let's refine: The Redux state tracks 'lastApplied'.
    // The 'expected' logic is often soft (handled by verifying continuity).

    // Simplified specific logic:
    // If exactly what we wanted (or we are in loose mode):

    return {
      lastAppliedMessageId: msg.id,
      expectedStreamId: msgStreamId, // We assume "expected" tracks the *latest valid* we have.
      status: 'IN_SYNC',
      stats: {
        ...state.stats,
        lastReceiveTs: Date.now(),
        gapDetectedAt: null, // Clear gap
      },
    }
  }

  // 4. GAP DETECTED (Future Message)
  if (comparison > 0) {
    // Buffer it
    const newBuffer = { ...state.buffer, [msgStreamId]: msg }

    return {
      buffer: newBuffer,
      status: state.status === 'IN_SYNC' ? 'RECOVERING' : state.status,
      stats: {
        ...state.stats,
        bufferedCount: Object.keys(newBuffer).length,
        gapDetectedAt: state.stats.gapDetectedAt || Date.now(),
      },
    }
  }

  return {}
}
