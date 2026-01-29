import { describe, it, expect, vi, beforeEach } from 'vitest'
import { processMessageInternal, flushBuffer } from './engine'
import { commitMessage } from './storage'
import { triggerRecovery } from './recovery'
import type { ConversationState } from './types'
import type { NewMessagePayload } from '@/shared/ws/protocol'

// Mocks
vi.mock('./storage', () => ({
  commitMessage: vi.fn(),
}))
vi.mock('./recovery', () => ({
  triggerRecovery: vi.fn(),
}))

const createMsg = (seq: number, streamId: string): NewMessagePayload => ({
  id: `msg-${seq}`,
  sequence: seq,
  streamId: streamId,
  conversationId: 'c1',
  content: 'text',
  authorId: 'u1',
  createdAt: new Date().toISOString(),
  dedupeId: `dedupe-${seq}`,
  projectId: 'p1',
  type: 'chat:new-message',
})

describe('Resequencer Engine', () => {
  let state: ConversationState

  beforeEach(() => {
    state = {
      conversationId: 'c1',
      projectId: 'p1',
      lastSequence: 10,
      expectedStreamId: null, // Legacy field
      lastStreamIdSeen: '17000-0',
      buffer: new Map(),
      status: 'SYNCED',
      gapTimer: null,
      recoveryAttempts: 0,
      lastOpenedAt: Date.now(),
    }
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  it('drops duplicate/old messages', async () => {
    const msg = createMsg(10, '17000-0')
    await processMessageInternal(state, msg, 'p1')

    expect(commitMessage).not.toHaveBeenCalled()
    expect(state.buffer.size).toBe(0)
  })

  it('commits strictly next message', async () => {
    const msg = createMsg(11, '17000-1')
    await processMessageInternal(state, msg, 'p1')

    expect(commitMessage).toHaveBeenCalledWith(state, msg, 'p1')
    expect(state.buffer.size).toBe(0)
  })

  it('buffers gap message and triggers recovery', async () => {
    const msg = createMsg(13, '17000-3') // Gap: 11, 12 missing
    await processMessageInternal(state, msg, 'p1')

    expect(commitMessage).not.toHaveBeenCalled()
    expect(state.buffer.size).toBe(1)
    expect(state.buffer.get('17000-3')).toBe(msg)

    // Timer should be set
    expect(state.gapTimer).toBeDefined()

    // Fast forward timer
    vi.advanceTimersByTime(100)

    expect(triggerRecovery).toHaveBeenCalled()
    expect(state.status).toBe('RECOVERING')
  })

  it('flushes buffer when missing message arrives', async () => {
    // 1. Receive 13 (Gap)
    const msg13 = createMsg(13, '17000-3')
    state.buffer.set(msg13.streamId, msg13)

    // 2. Mock commit to update state
    vi.mocked(commitMessage).mockImplementation(async (s, m) => {
      s.lastSequence = m.sequence
    })

    // 3. Receive 11
    const msg11 = createMsg(11, '17000-1')
    await processMessageInternal(state, msg11, 'p1')
    // State -> 11

    // 4. Missing 12 still prevents 13 from flushing
    expect(state.lastSequence).toBe(11)
    expect(state.buffer.has('17000-3')).toBe(true)

    // 5. Receive 12
    const msg12 = createMsg(12, '17000-2')
    await processMessageInternal(state, msg12, 'p1')
    // State -> 12, then Flush -> 13 -> State 13

    expect(state.lastSequence).toBe(13)
    expect(state.buffer.size).toBe(0)
  })
})
