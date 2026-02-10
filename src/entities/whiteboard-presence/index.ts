// Model
export { whiteboardPresenceSlice } from './model/slice'
export type {
  WhiteboardPresenceState,
  CollaboratorPresence,
  CursorPosition,
} from './model/types'
export * from './model/selectors'
export * as whiteboardPresenceActions from './model/slice'

// Hooks
export { useIdleDetection } from './hooks/use-idle-detection'
export { useActiveCollaborators } from './hooks/use-active-collaborators'

// UI
export { RemoteCursor } from './ui/remote-cursor'
export { CollaboratorAvatar } from './ui/collaborator-avatar'

// Lib (⚠️ Only for features/whiteboard-events)
export { assignColor } from './lib/color-assignment'
export { handlePointerMove, sendCursorUpdate } from './lib/cursor-throttle'
