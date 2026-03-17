export interface CursorPosition {
  x: number
  y: number
  pointer?: 'mouse' | 'touch' | 'pen' // Optional for remote updates
}

export interface CollaboratorPresence {
  userId: string
  fullName: string // Changed from userName to match GraphQL contracts
  avatarUrl: string | null
  cursor: CursorPosition | null
  isDrawing: boolean
  isIdle: boolean
  joinedAt: number
  color: string
}

export interface WhiteboardPresenceState {
  remoteCursors: Record<string, CollaboratorPresence | undefined>
  totalCount: number
}
