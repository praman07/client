import { gql } from '@/gql'

export const INVITE_TO_WORKSPACE = gql(`
  mutation InviteToWorkspace($input: InviteToWorkspaceInput!) {
    inviteToWorkspace(input: $input) {
      success
      message
      invitedCount
    }
  }
`)

export const GET_WORKSPACE_ROLES = gql(`
  query InviteMemberGetWorkspaceRoles($workspaceId: ID!) {
    workspaceRoles(workspaceId: $workspaceId) {
      id
      name
      rank
    }
  }
`)