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

export type Mutation = {
  __typename?: 'Mutation'
  _health?: Maybe<Scalars['String']['output']>
  createOnboardingWorkspace: Workspace
  syncUser: User
}

export type MutationSyncUserArgs = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>
  clerkId: Scalars['String']['input']
  email: Scalars['String']['input']
  fullName?: InputMaybe<Scalars['String']['input']>
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
  health: Scalars['String']['output']
  me?: Maybe<User>
  myWorkspaces: Array<Workspace>
  onboardingStatus: OnboardingStatus
  workspaceBySlug: Workspace
}

export type QueryWorkspaceBySlugArgs = {
  slug: Scalars['String']['input']
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
