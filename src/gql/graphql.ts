/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = T | null | undefined
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

export type AcceptInviteInput = {
  token: Scalars['String']['input']
  userEmail: Scalars['String']['input']
  userId: Scalars['String']['input']
}

export type AvailabilityResponse = {
  __typename?: 'AvailabilityResponse'
  available: Scalars['Boolean']['output']
  message?: Maybe<Scalars['String']['output']>
  reservationId?: Maybe<Scalars['String']['output']>
}

export type CreateWorkspaceInput = {
  name: Scalars['String']['input']
  slug: Scalars['String']['input']
}

export type InviteResponse = {
  __typename?: 'InviteResponse'
  invitedCount: Scalars['Int']['output']
  message: Scalars['String']['output']
  success: Scalars['Boolean']['output']
}

export type InviteToWorkspaceInput = {
  emails: Array<Scalars['String']['input']>
  workspaceId: Scalars['String']['input']
}

export type JoinResponse = {
  __typename?: 'JoinResponse'
  message: Scalars['String']['output']
  success: Scalars['Boolean']['output']
  workspaceSlug: Scalars['String']['output']
}

export type Mutation = {
  __typename?: 'Mutation'
  _health?: Maybe<Scalars['String']['output']>
  acceptWorkspaceInvite: JoinResponse
  checkSlugAvailability: AvailabilityResponse
  createOnboardingWorkspace: Workspace
  createWorkspace: Workspace
  inviteToWorkspace: InviteResponse
  removeWorkspaceMember: InviteResponse
  syncUser: User
  updateWorkspaceMemberRole: WorkspaceMember
}

export type MutationAcceptWorkspaceInviteArgs = {
  input: AcceptInviteInput
}

export type MutationCheckSlugAvailabilityArgs = {
  slug: Scalars['String']['input']
}

export type MutationCreateWorkspaceArgs = {
  name: Scalars['String']['input']
  slug: Scalars['String']['input']
}

export type MutationInviteToWorkspaceArgs = {
  input: InviteToWorkspaceInput
}

export type MutationRemoveWorkspaceMemberArgs = {
  memberId: Scalars['ID']['input']
  workspaceId: Scalars['ID']['input']
}

export type MutationSyncUserArgs = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>
  clerkId: Scalars['String']['input']
  email: Scalars['String']['input']
  fullName?: InputMaybe<Scalars['String']['input']>
}

export type MutationUpdateWorkspaceMemberRoleArgs = {
  memberId: Scalars['ID']['input']
  role: Scalars['String']['input']
  workspaceId: Scalars['ID']['input']
}

export type OnboardingStatus = {
  __typename?: 'OnboardingStatus'
  hasProject: Scalars['Boolean']['output']
  hasUser: Scalars['Boolean']['output']
  hasWorkspace: Scalars['Boolean']['output']
  workspaceSlug?: Maybe<Scalars['String']['output']>
}

export type Query = {
  __typename?: 'Query'
  getWorkspaceInviteInfo: WorkspaceInviteInfo
  health: Scalars['String']['output']
  me?: Maybe<User>
  myWorkspaces: Array<Workspace>
  onboardingStatus: OnboardingStatus
  workspaceBySlug: Workspace
  workspaceMembers: Array<WorkspaceMember>
}

export type QueryGetWorkspaceInviteInfoArgs = {
  token: Scalars['String']['input']
}

export type QueryWorkspaceBySlugArgs = {
  slug: Scalars['String']['input']
}

export type QueryWorkspaceMembersArgs = {
  workspaceId: Scalars['ID']['input']
}

export type User = {
  __typename?: 'User'
  avatarUrl?: Maybe<Scalars['String']['output']>
  createdAt: Scalars['String']['output']
  email: Scalars['String']['output']
  fullName?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  status: Scalars['String']['output']
  updatedAt: Scalars['String']['output']
}

export type Workspace = {
  __typename?: 'Workspace'
  createdAt: Scalars['String']['output']
  domainWhitelist?: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
  logoUrl?: Maybe<Scalars['String']['output']>
  name: Scalars['String']['output']
  slug: Scalars['String']['output']
  updatedAt: Scalars['String']['output']
}

export type WorkspaceInviteInfo = {
  __typename?: 'WorkspaceInviteInfo'
  inviterName: Scalars['String']['output']
  workspaceLogoUrl?: Maybe<Scalars['String']['output']>
  workspaceName: Scalars['String']['output']
}

export type WorkspaceMember = {
  __typename?: 'WorkspaceMember'
  id: Scalars['ID']['output']
  joinedAt: Scalars['String']['output']
  role: Scalars['String']['output']
  user: User
}

export type SessionUserFragment = {
  __typename?: 'User'
  id: string
  email: string
  fullName?: string | null
  avatarUrl?: string | null
} & { ' $fragmentName'?: 'SessionUserFragment' }

export type SessionWorkspaceFragment = {
  __typename?: 'Workspace'
  id: string
  slug: string
  name: string
  logoUrl?: string | null
  domainWhitelist?: string | null
} & { ' $fragmentName'?: 'SessionWorkspaceFragment' }

export type GetMeQueryVariables = Exact<{ [key: string]: never }>

export type GetMeQuery = {
  __typename?: 'Query'
  me?:
    | ({ __typename?: 'User' } & {
        ' $fragmentRefs'?: { SessionUserFragment: SessionUserFragment }
      })
    | null
}

export type GetWorkspaceBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input']
}>

export type GetWorkspaceBySlugQuery = {
  __typename?: 'Query'
  workspaceBySlug: { __typename?: 'Workspace' } & {
    ' $fragmentRefs'?: { SessionWorkspaceFragment: SessionWorkspaceFragment }
  }
}

export type CreateWorkspaceMutationVariables = Exact<{
  slug: Scalars['String']['input']
  name: Scalars['String']['input']
}>

export type CreateWorkspaceMutation = {
  __typename?: 'Mutation'
  createWorkspace: {
    __typename?: 'Workspace'
    id: string
    slug: string
    name: string
  }
}

export type CheckSlugAvailabilityMutationVariables = Exact<{
  slug: Scalars['String']['input']
}>

export type CheckSlugAvailabilityMutation = {
  __typename?: 'Mutation'
  checkSlugAvailability: {
    __typename?: 'AvailabilityResponse'
    available: boolean
    message?: string | null
  }
}

export type InviteToWorkspaceMutationVariables = Exact<{
  input: InviteToWorkspaceInput
}>

export type InviteToWorkspaceMutation = {
  __typename?: 'Mutation'
  inviteToWorkspace: {
    __typename?: 'InviteResponse'
    success: boolean
    message: string
    invitedCount: number
  }
}

export type AcceptWorkspaceInviteMutationVariables = Exact<{
  input: AcceptInviteInput
}>

export type AcceptWorkspaceInviteMutation = {
  __typename?: 'Mutation'
  acceptWorkspaceInvite: {
    __typename?: 'JoinResponse'
    success: boolean
    message: string
    workspaceSlug: string
  }
}

export type GetWorkspaceInviteInfoQueryVariables = Exact<{
  token: Scalars['String']['input']
}>

export type GetWorkspaceInviteInfoQuery = {
  __typename?: 'Query'
  getWorkspaceInviteInfo: {
    __typename?: 'WorkspaceInviteInfo'
    workspaceName: string
    workspaceLogoUrl?: string | null
    inviterName: string
  }
}

export type SyncUserMutationVariables = Exact<{
  clerkId: Scalars['String']['input']
  email: Scalars['String']['input']
  fullName?: InputMaybe<Scalars['String']['input']>
  avatarUrl?: InputMaybe<Scalars['String']['input']>
}>

export type SyncUserMutation = {
  __typename?: 'Mutation'
  syncUser: { __typename?: 'User'; id: string }
}

export type CreateOnboardingWorkspaceMutationVariables = Exact<{
  [key: string]: never
}>

export type CreateOnboardingWorkspaceMutation = {
  __typename?: 'Mutation'
  createOnboardingWorkspace: {
    __typename?: 'Workspace'
    id: string
    slug: string
  }
}

export type OnboardingStatusQueryVariables = Exact<{ [key: string]: never }>

export type OnboardingStatusQuery = {
  __typename?: 'Query'
  onboardingStatus: {
    __typename?: 'OnboardingStatus'
    hasUser: boolean
    hasWorkspace: boolean
    hasProject: boolean
    workspaceSlug?: string | null
  }
}

export type GetWorkspaceMembersQueryVariables = Exact<{
  workspaceId: Scalars['ID']['input']
}>

export type GetWorkspaceMembersQuery = {
  __typename?: 'Query'
  workspaceMembers: Array<{
    __typename?: 'WorkspaceMember'
    id: string
    role: string
    joinedAt: string
    user: {
      __typename?: 'User'
      id: string
      fullName?: string | null
      email: string
      avatarUrl?: string | null
    }
  }>
}

export type UpdateWorkspaceMemberRoleMutationVariables = Exact<{
  workspaceId: Scalars['ID']['input']
  memberId: Scalars['ID']['input']
  role: Scalars['String']['input']
}>

export type UpdateWorkspaceMemberRoleMutation = {
  __typename?: 'Mutation'
  updateWorkspaceMemberRole: {
    __typename?: 'WorkspaceMember'
    id: string
    role: string
  }
}

export type RemoveWorkspaceMemberMutationVariables = Exact<{
  workspaceId: Scalars['ID']['input']
  memberId: Scalars['ID']['input']
}>

export type RemoveWorkspaceMemberMutation = {
  __typename?: 'Mutation'
  removeWorkspaceMember: {
    __typename?: 'InviteResponse'
    success: boolean
    message: string
  }
}

export type GetMyWorkspacesQueryVariables = Exact<{ [key: string]: never }>

export type GetMyWorkspacesQuery = {
  __typename?: 'Query'
  myWorkspaces: Array<{
    __typename?: 'Workspace'
    id: string
    slug: string
    name: string
    logoUrl?: string | null
  }>
}

export const SessionUserFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SessionUser' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'User' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'avatarUrl' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SessionUserFragment, unknown>
export const SessionWorkspaceFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SessionWorkspace' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Workspace' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'logoUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'domainWhitelist' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SessionWorkspaceFragment, unknown>
export const GetMeDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetMe' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'me' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'SessionUser' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SessionUser' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'User' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'avatarUrl' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>
export const GetWorkspaceBySlugDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetWorkspaceBySlug' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'workspaceBySlug' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'slug' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'SessionWorkspace' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SessionWorkspace' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Workspace' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'logoUrl' } },
          { kind: 'Field', name: { kind: 'Name', value: 'domainWhitelist' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetWorkspaceBySlugQuery,
  GetWorkspaceBySlugQueryVariables
>
export const CreateWorkspaceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateWorkspace' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createWorkspace' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'slug' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateWorkspaceMutation,
  CreateWorkspaceMutationVariables
>
export const CheckSlugAvailabilityDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CheckSlugAvailability' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'checkSlugAvailability' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'slug' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'available' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CheckSlugAvailabilityMutation,
  CheckSlugAvailabilityMutationVariables
>
export const InviteToWorkspaceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'InviteToWorkspace' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'InviteToWorkspaceInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'inviteToWorkspace' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'invitedCount' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  InviteToWorkspaceMutation,
  InviteToWorkspaceMutationVariables
>
export const AcceptWorkspaceInviteDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AcceptWorkspaceInvite' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'AcceptInviteInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'acceptWorkspaceInvite' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'workspaceSlug' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AcceptWorkspaceInviteMutation,
  AcceptWorkspaceInviteMutationVariables
>
export const GetWorkspaceInviteInfoDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetWorkspaceInviteInfo' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'token' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getWorkspaceInviteInfo' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'token' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'token' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'workspaceName' },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'workspaceLogoUrl' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'inviterName' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetWorkspaceInviteInfoQuery,
  GetWorkspaceInviteInfoQueryVariables
>
export const SyncUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SyncUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'clerkId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'fullName' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'avatarUrl' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'syncUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'clerkId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'clerkId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'email' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'fullName' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'fullName' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'avatarUrl' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'avatarUrl' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SyncUserMutation, SyncUserMutationVariables>
export const CreateOnboardingWorkspaceDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateOnboardingWorkspace' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createOnboardingWorkspace' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateOnboardingWorkspaceMutation,
  CreateOnboardingWorkspaceMutationVariables
>
export const OnboardingStatusDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'OnboardingStatus' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'onboardingStatus' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'hasUser' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'hasWorkspace' },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'hasProject' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'workspaceSlug' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  OnboardingStatusQuery,
  OnboardingStatusQueryVariables
>
export const GetWorkspaceMembersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetWorkspaceMembers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'workspaceId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'workspaceMembers' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'workspaceId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'workspaceId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                { kind: 'Field', name: { kind: 'Name', value: 'joinedAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fullName' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'avatarUrl' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetWorkspaceMembersQuery,
  GetWorkspaceMembersQueryVariables
>
export const UpdateWorkspaceMemberRoleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateWorkspaceMemberRole' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'workspaceId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'memberId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'role' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateWorkspaceMemberRole' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'workspaceId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'workspaceId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'memberId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'memberId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'role' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'role' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'role' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateWorkspaceMemberRoleMutation,
  UpdateWorkspaceMemberRoleMutationVariables
>
export const RemoveWorkspaceMemberDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveWorkspaceMember' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'workspaceId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'memberId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeWorkspaceMember' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'workspaceId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'workspaceId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'memberId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'memberId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RemoveWorkspaceMemberMutation,
  RemoveWorkspaceMemberMutationVariables
>
export const GetMyWorkspacesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetMyWorkspaces' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'myWorkspaces' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'logoUrl' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetMyWorkspacesQuery,
  GetMyWorkspacesQueryVariables
>
