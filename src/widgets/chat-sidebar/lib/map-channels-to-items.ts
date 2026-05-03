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

export interface ProjectDmItem {
  id: string
  otherUser: {
    id: string
    fullName: string
    avatarUrl?: string | null
  }
  unreadCount: number
  updatedAt: string
}

/**
 * Map ProjectDmItem[] (from getProjectDms) to sidebar DMItem format.
 * Replaces the old stub that used Conversation.name as a fallback.
 */
export function mapDmsToItems(dms: Array<ProjectDmItem>): Array<DMItem> {
  return dms.map((dm) => ({
    id: dm.id,
    userId: dm.otherUser.id,
    name: dm.otherUser.fullName || 'Deleted User',
    avatarUrl: dm.otherUser.avatarUrl ?? undefined,
    status: 'offline' as const, // Phase 3: integrate presence
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
