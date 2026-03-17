export interface PageCollaboratorPresence {
  userId: string
  fullName: string
  avatarUrl: string | null
  /**
   * isIdle: set by idle-detection on the remote client via awareness update.
   * Not tracked for pages yet — included for parity, defaults to false.
   */
  isIdle: boolean
  joinedAt: number
  /**
   * Deterministic color from assignColor(userId).
   * Assigned automatically in slice reducers — never sent over the wire.
   */
  color: string
  /**
   * NOTE: No cursor field.
   * For whiteboards, cursors are canvas {x,y} coords dispatched to Redux.
   * For pages, Tiptap's CollaborationCursor extension renders remote cursors
   * directly from the y-protocols Awareness object — Redux is not involved.
   */
}

export interface PagePresenceState {
  collaborators: Record<string, PageCollaboratorPresence | undefined>
  totalCount: number
}
