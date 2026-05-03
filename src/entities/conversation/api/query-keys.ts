import { ConversationType } from '@/gql/graphql'

/**
 * TanStack Query key factory for conversations
 * Follows hierarchical, type-safe best practices
 */

export const conversationKeys = {
  /**
   * All conversations in a workspace/project
   */
  all: (workspaceId: string, projectId: string) =>
    ['conversations', workspaceId, projectId] as const,

  /**
   * Conversations filtered by type
   */
  byType: (workspaceId: string, projectId: string, type: ConversationType) =>
    [...conversationKeys.all(workspaceId, projectId), type] as const,

  /**
   * Convenience: All channels
   */
  channels: (workspaceId: string, projectId: string) =>
    conversationKeys.byType(workspaceId, projectId, ConversationType.Channel),

  /**
   * Convenience: All DMs
   */
  dms: (workspaceId: string, projectId: string) =>
    conversationKeys.byType(workspaceId, projectId, ConversationType.Dm),

  /**
   * Convenience: All group DMs
   */
  groups: (workspaceId: string, projectId: string) =>
    conversationKeys.byType(workspaceId, projectId, ConversationType.GroupDm),

  /**
   * Convenience: All threads
   */
  threads: (workspaceId: string, projectId: string) =>
    conversationKeys.byType(workspaceId, projectId, ConversationType.Thread),

  /**
   * Single conversation by ID
   */
  detail: (conversationId: string) => ['conversation', conversationId] as const,

  /**
   * Conversation notification preference
   */
  notifPreference: (conversationId: string) =>
    ['conversation', conversationId, 'notif'] as const,
}
