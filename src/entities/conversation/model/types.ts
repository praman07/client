import type { ConversationFieldsFragment } from '@/gql/graphql'
import { ConversationType } from '@/gql/graphql'

/**
 * Conversation entity type
 * Unified type combining list and detail views
 */
export type Conversation = ConversationFieldsFragment

/**
 * Conversation member (from ConversationMemberDetails type)
 */
export interface ConversationMember {
  userId: string
  role: string
  isMuted: boolean
  joinedAt: string
  user: {
    id: string
    fullName: string
    email: string
    avatarUrl?: string | null
  }
}

/**
 * Detailed conversation (matches ConversationDetails from GraphQL schema)
 * Includes members and additional metadata
 */
export interface ConversationDetail {
  id: string
  type: ConversationType
  name: string | null
  description: string | null
  slug: string | null
  isArchived: boolean
  unreadCount: number
  lastMessageAt: string | null
  parentMessageId?: string | null
  createdBy?: string | null
  members: Array<ConversationMember>
}

/**
 * Type guards
 */
export const isChannel = (conv: Conversation): boolean =>
  conv.type === ConversationType.Channel
export const isDM = (conv: Conversation): boolean =>
  conv.type === ConversationType.Dm
export const isGroupDM = (conv: Conversation): boolean =>
  conv.type === ConversationType.GroupDm
export const isThread = (conv: Conversation): boolean =>
  conv.type === ConversationType.Thread

/**
 * Helper: Get conversation icon
 */
export const getConversationIcon = (type: ConversationType): string => {
  switch (type) {
    case ConversationType.Channel:
      return '#'
    case ConversationType.Dm:
      return '💬'
    case ConversationType.GroupDm:
      return '👥'
    case ConversationType.Thread:
      return '🧵'
    default:
      return '💬'
  }
}

// Notification preference shape returned by conversationNotifPreference query
export interface ConversationNotifPreference {
  conversationId: string;
  mode: 'ALL_MESSAGES' | 'MENTIONS_ONLY' | 'NOTHING';
  muteUntil: string | null;
  pushEnabled: boolean | null;
  emailEnabled: boolean | null;
}
