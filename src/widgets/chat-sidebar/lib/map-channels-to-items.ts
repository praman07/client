import type { Conversation } from '@/entities/conversation'
import type { ChannelItem, DMItem, GroupItem } from '../model/types'

/**
 * Map channels to sidebar item format
 */
export function mapConversationsToItems(
  conversations: Array<Conversation>,
): Array<ChannelItem> {
  return conversations.map((conv) => ({
    id: conv.id,
    name: conv.name || 'Unnamed Channel',
    type: conv.isPublic ? 'public' : 'private',
    unreadCount: conv.unreadCount,
  }))
}

/**
 * Map DM conversations to sidebar item format
 * Note: Currently uses conversation name. For full user details, use Phase 2 implementation.
 */
export function mapDmsToItems(dms: Array<Conversation>): Array<DMItem> {
  return dms.map((dm) => ({
    id: dm.id,
    userId: dm.id, // Placeholder - in Phase 2, extract actual other user ID
    name: dm.name || dm.description || 'Direct Message',
    avatarUrl: undefined, // Phase 2: Get from user data
    status: 'offline' as const, // Phase 2: Integrate presence
    unreadCount: dm.unreadCount,
  }))
}

/**
 * Map group conversations to sidebar item format
 */
export function mapGroupsToItems(
  groups: Array<Conversation>,
): Array<GroupItem> {
  return groups.map((group) => ({
    id: group.id,
    name: group.name || 'Unnamed Group',
    memberCount: group.memberCount,
    avatarUrl: null, // Future: Custom group avatars
    unreadCount: group.unreadCount,
  }))
}

// Legacy export for backward compatibility during migration
export const mapChannelsToItems = mapConversationsToItems
