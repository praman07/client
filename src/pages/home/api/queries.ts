import { gql } from '@/gql'

export const GET_USER_HOME_QUERY = gql(`
  query GetUserHome {
    userHome {
      user {
        id
        fullName
        avatarUrl
        email
      }
      workspaces {
        id
        slug
        name
        logoUrl
        memberRole
      }
      pendingInvites {
        id
        token
        workspaceName
        role
      }
    }
  }
`)
