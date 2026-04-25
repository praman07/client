import { gql } from "graphql-request";

export const DECLINE_WORKSPACE_INVITE = gql`
  mutation DeclineWorkspaceInvite($input: DeclineWorkspaceInviteInput!) {
    declineWorkspaceInvite(input: $input) {
      success
      message
    }
  }
`;
