import type { ConversationType } from '..'
import type { Conversation } from '../model/types'

/**
 * Get display name for conversation
 * Handles unnamed DMs and groups
 */
export function getConversationDisplayName(conversation: Conversation): string {
  if (conversation.name) return conversation.name

  // DMs and groups might not have custom names
  switch (conversation.type) {
    case 'DM':
      return 'Direct Message'
    case 'GROUP_DM':
      return `Group (${conversation.memberCount} members)`
    case 'THREAD':
      return 'Thread'
    case 'CHANNEL':
      return conversation.name || 'Unnamed Channel'
    default:
      return 'Conversation'
  }
}

/**
 * Sort conversations by priority
 * Unread first, then by last message time
 */
export function sortConversations(
  conversations: Array<Conversation>,
): Array<Conversation> {
  return [...conversations].sort((a, b) => {
    // Unread first
    if (a.unreadCount && !b.unreadCount) return -1
    if (!a.unreadCount && b.unreadCount) return 1

    // Then by last message time or updated time
    const aTime = a.lastMessage?.createdAt || a.updatedAt
    const bTime = b.lastMessage?.createdAt || b.updatedAt

    return new Date(bTime).getTime() - new Date(aTime).getTime()
  })
}

/**
 * Filter conversations by type
 */
export function filterByType(
  conversations: Array<Conversation>,
  type: ConversationType,
): Array<Conversation> {
  return conversations.filter((conv) => conv.type === type)
}

/**
 * Filter active (non-archived) conversations
 */
export function filterActive(
  conversations: Array<Conversation>,
): Array<Conversation> {
  return conversations.filter((conv) => !conv.deletedAt)
}

/**
 * Filter archived conversations
 */
export function filterArchived(
  conversations: Array<Conversation>,
): Array<Conversation> {
  return conversations.filter((conv) => !!conv.deletedAt)
}

/**
 * Get total unread count across conversations
 */
export function getTotalUnreadCount(
  conversations: Array<Conversation>,
): number {
  return conversations.reduce(
    (total, conv) => total + (conv.unreadCount || 0),
    0,
  )
}

/**
 * Check if conversation has unread messages
 */
export function hasUnread(conversation: Conversation): boolean {
  return (conversation.unreadCount || 0) > 0
}

/**
 * Get conversations with unread messages
 */
export function getConversationsWithUnread(
  conversations: Array<Conversation>,
): Array<Conversation> {
  return conversations.filter(hasUnread)
}
