import { gql } from "graphql-request";

export const GET_USER_HOME_QUERY = gql`
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
`;

export const userHomeKeys = {
  all: ["userHome"] as const,
  detail: () => [...userHomeKeys.all, "detail"] as const,
};
