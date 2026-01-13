import { gql } from '@/gql'

export const GET_WORKSPACE_INVITE_INFO = gql(`
  query GetWorkspaceInviteInfo($token: String!) {
    getWorkspaceInviteInfo(token: $token) {
      workspaceName
      workspaceLogoUrl
      inviterName
    }
  }
`)
