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
