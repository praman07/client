/**
 * Access Revoked — Shared Query Invalidation Utilities
 *
 * Provides centralized query invalidation logic for when user's access is
 * revoked at workspace, project, or channel level.
 *
 * Usage:
 *   import { invalidateOnWorkspaceRemoval } from '@/features/access-revoked/lib/invalidate-queries'
 *   invalidateOnWorkspaceRemoval(workspaceId)
 */

import { queryClient } from '@/shared/lib/tanstack-query/query-client'
import { projectKeys } from '@/entities/project/api/query-keys'
import { workspaceMemberKeys } from '@/features/view-members/api/query-keys'
import { conversationKeys } from '@/entities/conversation/api/query-keys'
import { db } from '@/shared/lib/db'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('access-revoked:invalidation')

// ============================================================================
// WORKSPACE LEVEL — Highest impact
// ============================================================================

/**
 * Invalidate all queries related to workspace membership.
 * Called when user is removed from a workspace.
 */
export function invalidateOnWorkspaceRemoval(workspaceId: string) {
  log.info('Invalidating workspace queries', { workspaceId })

  // Workspace-level queries
  queryClient.invalidateQueries({
    queryKey: ['workspaces'],
  })
  queryClient.invalidateQueries({
    queryKey: workspaceMemberKeys.list(workspaceId),
  })

  // Project list (user may have lost access to projects)
  queryClient.invalidateQueries({
    queryKey: projectKeys.lists(),
  })
  queryClient.invalidateQueries({
    queryKey: projectKeys.list(workspaceId),
  })

  // All conversations (channels, DMs, etc.)
  queryClient.invalidateQueries({
    queryKey: ['conversations'],
  })

  // User's workspaces list
  queryClient.invalidateQueries({
    queryKey: ['my-workspaces'],
  })

  // TODO: Also trigger GraphQL cache invalidation via WS if needed
}

// ============================================================================
// PROJECT LEVEL — Medium impact
// ============================================================================

/**
 * Invalidate queries related to project membership.
 * Called when user is removed from a project.
 */
export function invalidateOnProjectRemoval(
  projectId: string,
  workspaceId?: string
) {
  log.info('Invalidating project queries', { projectId, workspaceId })

  // Project members
  queryClient.invalidateQueries({
    queryKey: ['projectMembers', projectId],
  })

  // Project details
  if (workspaceId) {
    queryClient.invalidateQueries({
      queryKey: projectKeys.detail(workspaceId, projectId),
    })
  }

  queryClient.invalidateQueries({
    queryKey: projectKeys.overview(projectId),
  })

  // Conversations (may have lost channel access)
  queryClient.invalidateQueries({
    queryKey: ['conversations'],
  })

  // Project list for the workspace
  if (workspaceId) {
    queryClient.invalidateQueries({
      queryKey: projectKeys.list(workspaceId),
    })
  }

  // Clear from local IndexedDB conversations cache
  clearConversationCacheForProject(projectId)
}

// ============================================================================
// CHANNEL LEVEL — Lowest impact, most specific
// ============================================================================

/**
 * Invalidate queries related to channel membership.
 * Called when user is removed from a channel.
 */
export function invalidateOnChannelRemoval(
  conversationId: string,
  workspaceId?: string,
  projectId?: string
) {
  log.info('Invalidating channel queries', { conversationId, workspaceId, projectId })

  // Channel members
  queryClient.invalidateQueries({
    queryKey: ['channelMembers', conversationId],
  })

  // Messages for this channel
  queryClient.invalidateQueries({
    queryKey: ['messages', conversationId],
  })

  // Conversation details
  queryClient.invalidateQueries({
    queryKey: conversationKeys.detail(conversationId),
  })

  // Conversations list
  if (workspaceId && projectId) {
    queryClient.invalidateQueries({
      queryKey: conversationKeys.all(workspaceId, projectId),
    })
    queryClient.invalidateQueries({
      queryKey: conversationKeys.channels(workspaceId, projectId),
    })
  }

  // Clear from local IndexedDB
  clearChannelFromCache(conversationId)
}

// ============================================================================
// INDEXEDDB CLEANUP
// ============================================================================

/**
 * Remove channel messages and state from local IndexedDB cache.
 * Called when user loses access to a channel.
 */
async function clearChannelFromCache(conversationId: string): Promise<void> {
  try {
    await Promise.all([
      // Delete messages for this conversation
      db.messages.where('conversationId').equals(conversationId).delete(),
      // Delete conversation state
      db.conversation_state.where('conversationId').equals(conversationId).delete(),
      // Delete pending outbox items for this conversation
      db.outbox.where('conversationId').equals(conversationId).delete(),
    ])
    log.debug('Cleared IndexedDB cache for channel', { conversationId })
  } catch (error) {
    log.warn('Failed to clear IndexedDB cache', { error, conversationId })
  }
}

/**
 * Remove all conversations for a project from local IndexedDB cache.
 * Called when user loses access to a project.
 */
async function clearConversationCacheForProject(projectId: string): Promise<void> {
  try {
    await Promise.all([
      // Delete messages for this project
      db.messages.where('projectId').equals(projectId).delete(),
      // Delete conversation states for this project
      db.conversation_state.where('projectId').equals(projectId).delete(),
      // Delete pending outbox items for this project
      db.outbox.where('projectId').equals(projectId).delete(),
    ])
    log.debug('Cleared IndexedDB cache for project', { projectId })
  } catch (error) {
    log.warn('Failed to clear IndexedDB cache for project', { error, projectId })
  }
}

// ============================================================================
// UTILITY: Check if current user is affected
// ============================================================================

/**
 * Check if the current user is the one being removed.
 * Returns true if the current user's ID matches the removed user ID.
 */
export function isCurrentUserRemoved(
  currentUserId: string | null,
  removedUserId: string
): boolean {
  return currentUserId !== null && currentUserId === removedUserId
}