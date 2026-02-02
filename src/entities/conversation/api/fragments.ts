import { gql } from '@/gql'

// ──────────────────────────────────────────────────────────────────────────────
// ConversationEdge Fragment (for list queries)
// Matches ConversationEdge type from schema.graphql (lines 510-524)
// ──────────────────────────────────────────────────────────────────────────────

export const CONVERSATION_EDGE_FRAGMENT = gql(`
  fragment ConversationEdgeFields on ConversationEdge {
    id
    type
    name
    description
    isPublic
    workspaceId
    projectId
    memberCount
    unreadCount
    lastMessage {
      id
      content
      authorUserId
      createdAt
    }
    createdAt
    updatedAt
    deletedAt
  }
`)

// ──────────────────────────────────────────────────────────────────────────────
// Query: Get User Conversations (channels, DMs, groups, threads)
// Returns: ConversationConnection (schema.graphql line 505-508)
// ──────────────────────────────────────────────────────────────────────────────

export const GET_USER_CONVERSATIONS = gql(`
  query GetUserConversations(
    $workspaceId: ID!
    $projectId: ID!
    $type: ConversationType
    $includeArchived: Boolean
    $limit: Int
    $cursor: String
  ) {
    getUserConversations(
      workspaceId: $workspaceId
      projectId: $projectId
      type: $type
      includeArchived: $includeArchived
      limit: $limit
      cursor: $cursor
    ) {
      edges {
        ...ConversationEdgeFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`)

// ──────────────────────────────────────────────────────────────────────────────
// ConversationDetails Fragment (for single conversation with members)
// Matches ConversationDetails type from schema.graphql (lines 533-550)
// ──────────────────────────────────────────────────────────────────────────────

export const CONVERSATION_DETAILS_FRAGMENT = gql(`
  fragment ConversationDetailsFields on ConversationDetails {
    id
    type
    name
    description
    isPublic
    workspaceId
    projectId
    parentMessageId
    createdBy
    memberCount
    unreadCount
    members {
      userId
      role
      isMuted
      joinedAt
      user {
        id
        fullName
        email
        avatarUrl
      }
    }
    lastMessage {
      id
      content
      authorUserId
      createdAt
    }
    createdAt
    updatedAt
    deletedAt
  }
`)

// ──────────────────────────────────────────────────────────────────────────────
// Query: Get Single Conversation (with members)
// Returns: ConversationDetails (schema.graphql line 46)
// ──────────────────────────────────────────────────────────────────────────────

export const GET_CONVERSATION = gql(`
  query GetConversation($conversationId: ID!) {
    getConversation(conversationId: $conversationId) {
      ...ConversationDetailsFields
    }
  }
`)

// ──────────────────────────────────────────────────────────────────────────────
// Legacy exports for backward compatibility
// ──────────────────────────────────────────────────────────────────────────────

export { CONVERSATION_EDGE_FRAGMENT as CONVERSATION_FIELDS_FRAGMENT }
