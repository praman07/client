import { base64ToUint8Array } from '@/entities/whiteboard-session'

export interface DecodedSnapshot {
  boardId: string
  diff: Uint8Array
  lastStreamId: string | null
  snapshotTimestamp: string | null
}

export function decodeSnapshot(raw: {
  boardId: string
  snapshot: string
  lastStreamId?: string | null
  snapshotTimestamp?: string | null
}): DecodedSnapshot {
  return {
    boardId: raw.boardId,
    diff: base64ToUint8Array(raw.snapshot),
    lastStreamId: raw.lastStreamId ?? null,
    snapshotTimestamp: raw.snapshotTimestamp ?? null,
  }
}
