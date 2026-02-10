export interface CursorPosition {
  x: number
  y: number
  pointer: 'mouse' | 'touch' | 'pen'
}

export interface CollaboratorPresence {
  userId: string
  userName: string
  avatarUrl: string | null
  cursor: CursorPosition | null
  isDrawing: boolean
  isIdle: boolean
  joinedAt: number
  color: string
}

export interface WhiteboardPresenceState {
  remoteCursors: Record<string, CollaboratorPresence>
  totalCount: number
}
