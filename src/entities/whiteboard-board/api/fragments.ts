import { gql } from '@/gql'

export const BOARD_FIELDS = gql(`
  fragment BoardFields on Whiteboard {
    id
    workspaceId
    projectId
    title
    description
    elementCount
    fileSizeBytes
    isArchived
    isLocked
    createdBy
    createdAt
    updatedAt
  }
`)

export const BOARD_WITH_COLLABORATORS = gql(`
  fragment BoardWithCollaborators on Whiteboard {
    ...BoardFields
    collaborators {
      userId
      joinedAt
      user {
        id
        fullName
        email
        avatarUrl
      }
    }
  }
`)
