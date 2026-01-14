/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment SessionUser on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n": typeof types.SessionUserFragmentDoc,
    "\n  fragment SessionWorkspace on Workspace {\n    id\n    slug\n    name\n    logoUrl\n    domainWhitelist\n  }\n": typeof types.SessionWorkspaceFragmentDoc,
    "\n  query GetMe {\n    me {\n      ...SessionUser\n    }\n  }\n": typeof types.GetMeDocument,
    "\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...SessionWorkspace\n    }\n  }\n": typeof types.GetWorkspaceBySlugDocument,
    "\n  mutation CreateWorkspace($slug: String!, $name: String!) {\n    createWorkspace(slug: $slug, name: $name) {\n      id\n      slug\n      name\n    }\n  }\n": typeof types.CreateWorkspaceDocument,
    "\n  mutation CheckSlugAvailability($slug: String!) {\n    checkSlugAvailability(slug: $slug) {\n      available\n      message\n    }\n  }\n": typeof types.CheckSlugAvailabilityDocument,
    "\n  mutation InviteToWorkspace($input: InviteToWorkspaceInput!) {\n    inviteToWorkspace(input: $input) {\n      success\n      message\n      invitedCount\n    }\n  }\n": typeof types.InviteToWorkspaceDocument,
    "\n  mutation AcceptWorkspaceInvite($input: AcceptInviteInput!) {\n    acceptWorkspaceInvite(input: $input) {\n      success\n      message\n      workspaceSlug\n    }\n  }\n": typeof types.AcceptWorkspaceInviteDocument,
    "\n  query GetWorkspaceInviteInfo($token: String!) {\n    getWorkspaceInviteInfo(token: $token) {\n      workspaceName\n      workspaceLogoUrl\n      inviterName\n    }\n  }\n": typeof types.GetWorkspaceInviteInfoDocument,
    "\n  mutation SyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n    }\n  }\n": typeof types.SyncUserDocument,
    "\n  mutation CreateOnboardingWorkspace {\n    createOnboardingWorkspace {\n      id\n      slug\n    }\n  }\n": typeof types.CreateOnboardingWorkspaceDocument,
    "\n  query OnboardingStatus {\n    onboardingStatus {\n      hasUser\n      hasWorkspace\n      hasProject\n      workspaceSlug\n    }\n  }\n": typeof types.OnboardingStatusDocument,
    "\n  query GetWorkspaceMembers($workspaceId: ID!) {\n    workspaceMembers(workspaceId: $workspaceId) {\n      id\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n": typeof types.GetWorkspaceMembersDocument,
    "\n  mutation UpdateWorkspaceMemberRole($workspaceId: ID!, $memberId: ID!, $role: String!) {\n    updateWorkspaceMemberRole(workspaceId: $workspaceId, memberId: $memberId, role: $role) {\n      id\n      role\n    }\n  }\n": typeof types.UpdateWorkspaceMemberRoleDocument,
    "\n  mutation RemoveWorkspaceMember($workspaceId: ID!, $memberId: ID!) {\n    removeWorkspaceMember(workspaceId: $workspaceId, memberId: $memberId) {\n      success\n      message\n    }\n  }\n": typeof types.RemoveWorkspaceMemberDocument,
    "\n  query GetMyWorkspaces {\n    myWorkspaces {\n      id\n      slug\n      name\n      logoUrl\n    }\n  }\n": typeof types.GetMyWorkspacesDocument,
};
const documents: Documents = {
    "\n  fragment SessionUser on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n": types.SessionUserFragmentDoc,
    "\n  fragment SessionWorkspace on Workspace {\n    id\n    slug\n    name\n    logoUrl\n    domainWhitelist\n  }\n": types.SessionWorkspaceFragmentDoc,
    "\n  query GetMe {\n    me {\n      ...SessionUser\n    }\n  }\n": types.GetMeDocument,
    "\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...SessionWorkspace\n    }\n  }\n": types.GetWorkspaceBySlugDocument,
    "\n  mutation CreateWorkspace($slug: String!, $name: String!) {\n    createWorkspace(slug: $slug, name: $name) {\n      id\n      slug\n      name\n    }\n  }\n": types.CreateWorkspaceDocument,
    "\n  mutation CheckSlugAvailability($slug: String!) {\n    checkSlugAvailability(slug: $slug) {\n      available\n      message\n    }\n  }\n": types.CheckSlugAvailabilityDocument,
    "\n  mutation InviteToWorkspace($input: InviteToWorkspaceInput!) {\n    inviteToWorkspace(input: $input) {\n      success\n      message\n      invitedCount\n    }\n  }\n": types.InviteToWorkspaceDocument,
    "\n  mutation AcceptWorkspaceInvite($input: AcceptInviteInput!) {\n    acceptWorkspaceInvite(input: $input) {\n      success\n      message\n      workspaceSlug\n    }\n  }\n": types.AcceptWorkspaceInviteDocument,
    "\n  query GetWorkspaceInviteInfo($token: String!) {\n    getWorkspaceInviteInfo(token: $token) {\n      workspaceName\n      workspaceLogoUrl\n      inviterName\n    }\n  }\n": types.GetWorkspaceInviteInfoDocument,
    "\n  mutation SyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n    }\n  }\n": types.SyncUserDocument,
    "\n  mutation CreateOnboardingWorkspace {\n    createOnboardingWorkspace {\n      id\n      slug\n    }\n  }\n": types.CreateOnboardingWorkspaceDocument,
    "\n  query OnboardingStatus {\n    onboardingStatus {\n      hasUser\n      hasWorkspace\n      hasProject\n      workspaceSlug\n    }\n  }\n": types.OnboardingStatusDocument,
    "\n  query GetWorkspaceMembers($workspaceId: ID!) {\n    workspaceMembers(workspaceId: $workspaceId) {\n      id\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n": types.GetWorkspaceMembersDocument,
    "\n  mutation UpdateWorkspaceMemberRole($workspaceId: ID!, $memberId: ID!, $role: String!) {\n    updateWorkspaceMemberRole(workspaceId: $workspaceId, memberId: $memberId, role: $role) {\n      id\n      role\n    }\n  }\n": types.UpdateWorkspaceMemberRoleDocument,
    "\n  mutation RemoveWorkspaceMember($workspaceId: ID!, $memberId: ID!) {\n    removeWorkspaceMember(workspaceId: $workspaceId, memberId: $memberId) {\n      success\n      message\n    }\n  }\n": types.RemoveWorkspaceMemberDocument,
    "\n  query GetMyWorkspaces {\n    myWorkspaces {\n      id\n      slug\n      name\n      logoUrl\n    }\n  }\n": types.GetMyWorkspacesDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment SessionUser on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n"): (typeof documents)["\n  fragment SessionUser on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment SessionWorkspace on Workspace {\n    id\n    slug\n    name\n    logoUrl\n    domainWhitelist\n  }\n"): (typeof documents)["\n  fragment SessionWorkspace on Workspace {\n    id\n    slug\n    name\n    logoUrl\n    domainWhitelist\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMe {\n    me {\n      ...SessionUser\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      ...SessionUser\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...SessionWorkspace\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...SessionWorkspace\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateWorkspace($slug: String!, $name: String!) {\n    createWorkspace(slug: $slug, name: $name) {\n      id\n      slug\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateWorkspace($slug: String!, $name: String!) {\n    createWorkspace(slug: $slug, name: $name) {\n      id\n      slug\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CheckSlugAvailability($slug: String!) {\n    checkSlugAvailability(slug: $slug) {\n      available\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation CheckSlugAvailability($slug: String!) {\n    checkSlugAvailability(slug: $slug) {\n      available\n      message\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation InviteToWorkspace($input: InviteToWorkspaceInput!) {\n    inviteToWorkspace(input: $input) {\n      success\n      message\n      invitedCount\n    }\n  }\n"): (typeof documents)["\n  mutation InviteToWorkspace($input: InviteToWorkspaceInput!) {\n    inviteToWorkspace(input: $input) {\n      success\n      message\n      invitedCount\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AcceptWorkspaceInvite($input: AcceptInviteInput!) {\n    acceptWorkspaceInvite(input: $input) {\n      success\n      message\n      workspaceSlug\n    }\n  }\n"): (typeof documents)["\n  mutation AcceptWorkspaceInvite($input: AcceptInviteInput!) {\n    acceptWorkspaceInvite(input: $input) {\n      success\n      message\n      workspaceSlug\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaceInviteInfo($token: String!) {\n    getWorkspaceInviteInfo(token: $token) {\n      workspaceName\n      workspaceLogoUrl\n      inviterName\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceInviteInfo($token: String!) {\n    getWorkspaceInviteInfo(token: $token) {\n      workspaceName\n      workspaceLogoUrl\n      inviterName\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation SyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateOnboardingWorkspace {\n    createOnboardingWorkspace {\n      id\n      slug\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOnboardingWorkspace {\n    createOnboardingWorkspace {\n      id\n      slug\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query OnboardingStatus {\n    onboardingStatus {\n      hasUser\n      hasWorkspace\n      hasProject\n      workspaceSlug\n    }\n  }\n"): (typeof documents)["\n  query OnboardingStatus {\n    onboardingStatus {\n      hasUser\n      hasWorkspace\n      hasProject\n      workspaceSlug\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaceMembers($workspaceId: ID!) {\n    workspaceMembers(workspaceId: $workspaceId) {\n      id\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceMembers($workspaceId: ID!) {\n    workspaceMembers(workspaceId: $workspaceId) {\n      id\n      role\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateWorkspaceMemberRole($workspaceId: ID!, $memberId: ID!, $role: String!) {\n    updateWorkspaceMemberRole(workspaceId: $workspaceId, memberId: $memberId, role: $role) {\n      id\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateWorkspaceMemberRole($workspaceId: ID!, $memberId: ID!, $role: String!) {\n    updateWorkspaceMemberRole(workspaceId: $workspaceId, memberId: $memberId, role: $role) {\n      id\n      role\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveWorkspaceMember($workspaceId: ID!, $memberId: ID!) {\n    removeWorkspaceMember(workspaceId: $workspaceId, memberId: $memberId) {\n      success\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveWorkspaceMember($workspaceId: ID!, $memberId: ID!) {\n    removeWorkspaceMember(workspaceId: $workspaceId, memberId: $memberId) {\n      success\n      message\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMyWorkspaces {\n    myWorkspaces {\n      id\n      slug\n      name\n      logoUrl\n    }\n  }\n"): (typeof documents)["\n  query GetMyWorkspaces {\n    myWorkspaces {\n      id\n      slug\n      name\n      logoUrl\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;