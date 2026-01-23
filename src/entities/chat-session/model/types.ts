import type { Message } from '@/entities/message/model/types'

export type SessionStatus = 'IN_SYNC' | 'RECOVERING' | 'DESYNCED' | 'OFFLINE'

export interface ChannelSessionState {
  channelId: string
  expectedStreamId: string | null
  buffer: Record<string, Message>
  status: SessionStatus
  lastAppliedMessageId: string | null
  stats: {
    bufferedCount: number
    lastReceiveTs: number
    gapDetectedAt: number | null
  }
}

export interface ChatSessionState {
  sessions: Record<string, ChannelSessionState>
  globalConnectionState: 'connected' | 'disconnected' | 'reconnecting'
}
