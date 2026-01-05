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
    "\n  query GetMe {\n    me {\n      ...SessionUser\n    }\n  }\n": typeof types.GetMeDocument,
    "\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...SessionWorkspace\n    }\n  }\n": typeof types.GetWorkspaceBySlugDocument,
    "\n  fragment SessionUser on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n": typeof types.SessionUserFragmentDoc,
    "\n  fragment SessionWorkspace on Workspace {\n    id\n    slug\n    name\n    logoUrl\n    domainWhitelist\n  }\n": typeof types.SessionWorkspaceFragmentDoc,
    "\n  query OnboardingStatus {\n    onboardingStatus {\n      hasUser\n      hasWorkspace\n      hasProject\n      workspaceSlug\n    }\n  }\n": typeof types.OnboardingStatusDocument,
    "\n  mutation SyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n    }\n  }\n": typeof types.SyncUserDocument,
    "\n  mutation CreateOnboardingWorkspace {\n    createOnboardingWorkspace {\n      id\n      slug\n    }\n  }\n": typeof types.CreateOnboardingWorkspaceDocument,
    "\n  query GetMyWorkspaces {\n    myWorkspaces {\n      id\n      slug\n      name\n      logoUrl\n    }\n  }\n": typeof types.GetMyWorkspacesDocument,
};
const documents: Documents = {
    "\n  query GetMe {\n    me {\n      ...SessionUser\n    }\n  }\n": types.GetMeDocument,
    "\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...SessionWorkspace\n    }\n  }\n": types.GetWorkspaceBySlugDocument,
    "\n  fragment SessionUser on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n": types.SessionUserFragmentDoc,
    "\n  fragment SessionWorkspace on Workspace {\n    id\n    slug\n    name\n    logoUrl\n    domainWhitelist\n  }\n": types.SessionWorkspaceFragmentDoc,
    "\n  query OnboardingStatus {\n    onboardingStatus {\n      hasUser\n      hasWorkspace\n      hasProject\n      workspaceSlug\n    }\n  }\n": types.OnboardingStatusDocument,
    "\n  mutation SyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n    }\n  }\n": types.SyncUserDocument,
    "\n  mutation CreateOnboardingWorkspace {\n    createOnboardingWorkspace {\n      id\n      slug\n    }\n  }\n": types.CreateOnboardingWorkspaceDocument,
    "\n  query GetMyWorkspaces {\n    myWorkspaces {\n      id\n      slug\n      name\n      logoUrl\n    }\n  }\n": types.GetMyWorkspacesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMe {\n    me {\n      ...SessionUser\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      ...SessionUser\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...SessionWorkspace\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...SessionWorkspace\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SessionUser on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n"): (typeof documents)["\n  fragment SessionUser on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SessionWorkspace on Workspace {\n    id\n    slug\n    name\n    logoUrl\n    domainWhitelist\n  }\n"): (typeof documents)["\n  fragment SessionWorkspace on Workspace {\n    id\n    slug\n    name\n    logoUrl\n    domainWhitelist\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query OnboardingStatus {\n    onboardingStatus {\n      hasUser\n      hasWorkspace\n      hasProject\n      workspaceSlug\n    }\n  }\n"): (typeof documents)["\n  query OnboardingStatus {\n    onboardingStatus {\n      hasUser\n      hasWorkspace\n      hasProject\n      workspaceSlug\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation SyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateOnboardingWorkspace {\n    createOnboardingWorkspace {\n      id\n      slug\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOnboardingWorkspace {\n    createOnboardingWorkspace {\n      id\n      slug\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMyWorkspaces {\n    myWorkspaces {\n      id\n      slug\n      name\n      logoUrl\n    }\n  }\n"): (typeof documents)["\n  query GetMyWorkspaces {\n    myWorkspaces {\n      id\n      slug\n      name\n      logoUrl\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;