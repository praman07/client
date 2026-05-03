import { gql } from '@/gql'

// ──────────────────────────────────────────────────────────────────────────────
// Unified Conversation Fragment
// Backend unified ConversationEdge + ConversationDetails → Conversation
// ──────────────────────────────────────────────────────────────────────────────

export const CONVERSATION_FIELDS_FRAGMENT = gql(`
  fragment ConversationFields on Conversation {
    id
    type
    name
    description: topic
    topic
    isPublic
    workspaceId
    projectId
    parentMessageId
    createdBy
    isArchived
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
        members {
      ...ConversationMemberFields
    }
    myNotifMode
    isMuted
  }
`
)

export const CONVERSATION_MEMBER_FIELDS_FRAGMENT = gql(`
  fragment ConversationMemberFields on ConversationMember {
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
`)

// ──────────────────────────────────────────────────────────────────────────────
// Query: Get User Conversations (channels, DMs, groups, threads)
// Returns: ConversationConnection with unified Conversation type
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
        ...ConversationFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`)

// ──────────────────────────────────────────────────────────────────────────────
// Query: Get Single Conversation (with members)
// Returns: Conversation with populated members array
// ──────────────────────────────────────────────────────────────────────────────

export const GET_CONVERSATION = gql(`
  query GetConversation($conversationId: ID!) {
    getConversation(conversationId: $conversationId) {
      ...ConversationFields
      members {
        ...ConversationMemberFields
      }
    }
  }
`)

// ──────────────────────────────────────────────────────────────────────────────
// Legacy exports for backward compatibility during migration
// ──────────────────────────────────────────────────────────────────────────────

export const CONVERSATION_EDGE_FRAGMENT = CONVERSATION_FIELDS_FRAGMENT
export const CONVERSATION_DETAILS_FRAGMENT = CONVERSATION_FIELDS_FRAGMENT
