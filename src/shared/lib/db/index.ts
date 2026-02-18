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
  WhiteboardThumbnail,
  // ❌ WhiteboardPresence removed - ephemeral (Redux only)
} from './schema'
