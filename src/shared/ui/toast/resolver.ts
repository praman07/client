/**
 * Toast Data Resolver
 * 
 * Resolves user and conversation data from TanStack Query cache.
 * Uses existing queries - no additional API calls.
 */

import { queryClient } from '@/shared/lib/tanstack-query/query-client'
import { conversationKeys } from '@/entities/conversation/api/query-keys'
import { store } from '@/app/store/config'
import { selectCurrentWorkspaceId } from '@/entities/workspace'
import { selectCurrentProject } from '@/entities/project'

export interface ResolvedUser {
  id: string
  fullName: string
  avatarUrl: string | null
}

export interface ResolvedConversation {
  id: string
  name: string
  type: string
}

/**
 * Find user in conversation detail query cache
 */
function findUserInDetailCache(
  conversationId: string,
  actorId: string
): ResolvedUser | null {
  const key = conversationKeys.detail(conversationId)
  const data = queryClient.getQueryData(key) as any
  
  if (!data?.getConversation?.members) return null
  
  const member = data.getConversation.members.find(
    (m: any) => m.userId === actorId
  )
  
  if (member?.user) {
    return {
      id: actorId,
      fullName: member.user.fullName ?? 'Someone',
      avatarUrl: member.user.avatarUrl ?? null,
    }
  }
  
  return null
}

/**
 * Find user in conversation list query cache
 */
function findUserInListCache(
  conversationId: string,
  actorId: string
): ResolvedUser | null {
  const state = store.getState()
  const workspaceId = selectCurrentWorkspaceId(state)
  const project = selectCurrentProject(state)
  
  if (!workspaceId || !project?.id) return null

  const listKeys = [
    conversationKeys.all(workspaceId, project.id),
    conversationKeys.channels(workspaceId, project.id),
    conversationKeys.dms(workspaceId, project.id),
    conversationKeys.groups(workspaceId, project.id),
  ]

  for (const key of listKeys) {
    const data = queryClient.getQueryData(key) as any
    if (!data?.getUserConversations?.edges) continue
    
    const edge = data.getUserConversations.edges.find(
      (e: any) => e.id === conversationId
    )
    
    if (edge?.members) {
      const member = edge.members.find((m: any) => m.userId === actorId)
      if (member?.user) {
        return {
          id: actorId,
          fullName: member.user.fullName ?? 'Someone',
          avatarUrl: member.user.avatarUrl ?? null,
        }
      }
    }
  }

  return null
}

/**
 * Find user in Redux cache
 */
function findUserInReduxCache(
  conversationId: string,
  actorId: string
): ResolvedUser | null {
  const state = store.getState()
  const conversation = state.conversation.conversations[conversationId]
  
  if (!conversation?.members) return null
  
  const members = conversation.members as Array<{
    userId: string
    user?: { fullName?: string | null; avatarUrl?: string | null }
  }>
  
  const member = members.find((m) => m.userId === actorId)
  if (member?.user) {
    return {
      id: actorId,
      fullName: member.user.fullName ?? 'Someone',
      avatarUrl: member.user.avatarUrl ?? null,
    }
  }
  
  return null
}

/**
 * Resolve user from all caches, with fallback
 */
export function resolveUserFromCache(
  conversationId: string,
  actorId: string
): ResolvedUser {
  const fromDetail = findUserInDetailCache(conversationId, actorId)
  if (fromDetail) return fromDetail

  const fromList = findUserInListCache(conversationId, actorId)
  if (fromList) return fromList

  const fromRedux = findUserInReduxCache(conversationId, actorId)
  if (fromRedux) return fromRedux

  return { id: actorId, fullName: 'Someone', avatarUrl: null }
}

/**
 * Find conversation in detail query cache
 */
function findConversationInDetailCache(
  conversationId: string
): ResolvedConversation | null {
  const key = conversationKeys.detail(conversationId)
  const data = queryClient.getQueryData(key) as any
  
  if (data?.getConversation) {
    return {
      id: conversationId,
      name: data.getConversation.name ?? 'Direct Message',
      type: data.getConversation.type ?? 'DM',
    }
  }
  
  return null
}

/**
 * Find conversation in list query cache
 */
function findConversationInListCache(
  conversationId: string
): ResolvedConversation | null {
  const state = store.getState()
  const workspaceId = selectCurrentWorkspaceId(state)
  const project = selectCurrentProject(state)
  
  if (!workspaceId || !project?.id) return null

  const listKeys = [
    conversationKeys.all(workspaceId, project.id),
    conversationKeys.channels(workspaceId, project.id),
    conversationKeys.dms(workspaceId, project.id),
    conversationKeys.groups(workspaceId, project.id),
  ]

  for (const key of listKeys) {
    const data = queryClient.getQueryData(key) as any
    if (!data?.getUserConversations?.edges) continue
    
    const edge = data.getUserConversations.edges.find(
      (e: any) => e.id === conversationId
    )
    
    if (edge) {
      return {
        id: conversationId,
        name: edge.name ?? 'Direct Message',
        type: edge.type ?? 'DM',
      }
    }
  }

  return null
}

/**
 * Find conversation in Redux cache
 */
function findConversationInReduxCache(
  conversationId: string
): ResolvedConversation | null {
  const state = store.getState()
  const conversation = state.conversation.conversations[conversationId]
  
  if (conversation) {
    return {
      id: conversationId,
      name: conversation.name ?? 'Direct Message',
      type: conversation.type ?? 'DM',
    }
  }
  
  return null
}

/**
 * Resolve conversation from all caches, with fallback
 */
export function resolveConversationFromCache(
  conversationId: string
): ResolvedConversation {
  const fromDetail = findConversationInDetailCache(conversationId)
  if (fromDetail) return fromDetail

  const fromList = findConversationInListCache(conversationId)
  if (fromList) return fromList

  const fromRedux = findConversationInReduxCache(conversationId)
  if (fromRedux) return fromRedux

  return { id: conversationId, name: 'Conversation', type: 'DM' }
}
