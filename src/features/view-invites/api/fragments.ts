import { gql } from '@/gql'

export const GET_WORKSPACE_INVITES = gql(`
  query GetWorkspaceInvites($workspaceId: ID!) {
    workspaceInvites(workspaceId: $workspaceId) {
      id
      email
      role
      roleId
      expiresAt
      createdAt
    }
  }
`)

export const CANCEL_WORKSPACE_INVITE = gql(`
  mutation CancelWorkspaceInvite($inviteId: ID!, $workspaceId: ID!) {
    cancelWorkspaceInvite(inviteId: $inviteId, workspaceId: $workspaceId)
  }
`)

export const RESEND_WORKSPACE_INVITE = gql(`
  mutation ResendWorkspaceInvite($inviteId: ID!, $workspaceId: ID!) {
    resendWorkspaceInvite(inviteId: $inviteId, workspaceId: $workspaceId)
  }
`)
