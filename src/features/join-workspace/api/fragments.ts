import { gql } from '@/gql'

export const ACCEPT_WORKSPACE_INVITE = gql(`
  mutation AcceptWorkspaceInvite($input: AcceptInviteInput!) {
    acceptWorkspaceInvite(input: $input) {
      success
      message
      workspaceSlug
    }
  }
`)

export const GET_WORKSPACE_INVITE_INFO = gql(`
  query GetWorkspaceInviteInfo($token: String!) {
    getWorkspaceInviteInfo(token: $token) {
      workspaceName
      workspaceLogoUrl
      inviterName
    }
  }
`)
