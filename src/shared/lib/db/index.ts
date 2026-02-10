import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './schema'

export { db, useLiveQuery }
export type {
  DBMessage,
  OutboxItem,
  ConversationState,
  ProjectMeta,
  WhiteboardOfflineUpdate,
  WhiteboardBoardCache,
  // ❌ WhiteboardPresence removed - ephemeral (Redux only)
} from './schema'
