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
    "\n  fragment MessageRecoveryFields on ChatMessage {\n    id\n    streamId\n    sequence\n    conversationId\n    authorUserId\n    content\n    type\n    createdAt\n  }\n": typeof types.MessageRecoveryFieldsFragmentDoc,
    "\n  query GetMissingMessages($conversationId: ID!, $afterSequence: Int!, $limit: Int) {\n    messagesDelta(conversationId: $conversationId, afterSequence: $afterSequence, limit: $limit) {\n      messages {\n        ...MessageRecoveryFields\n      }\n      hasMore\n      lastSequence\n    }\n  }\n": typeof types.GetMissingMessagesDocument,
    "\n  query GetHistory($conversationId: ID!, $beforeSequence: Int!, $limit: Int) {\n    history(conversationId: $conversationId, beforeSequence: $beforeSequence, limit: $limit) {\n       messages {\n         ...MessageRecoveryFields\n       }\n       hasMore\n       minSequence\n    }\n  }\n": typeof types.GetHistoryDocument,
    "\n  fragment ConversationEdgeFields on ConversationEdge {\n    id\n    type\n    name\n    description\n    isPublic\n    workspaceId\n    projectId\n    memberCount\n    unreadCount\n    lastMessage {\n      id\n      content\n      authorUserId\n      createdAt\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n": typeof types.ConversationEdgeFieldsFragmentDoc,
    "\n  query GetUserConversations(\n    $workspaceId: ID!\n    $projectId: ID!\n    $type: ConversationType\n    $includeArchived: Boolean\n    $limit: Int\n    $cursor: String\n  ) {\n    getUserConversations(\n      workspaceId: $workspaceId\n      projectId: $projectId\n      type: $type\n      includeArchived: $includeArchived\n      limit: $limit\n      cursor: $cursor\n    ) {\n      edges {\n        ...ConversationEdgeFields\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": typeof types.GetUserConversationsDocument,
    "\n  fragment ConversationDetailsFields on ConversationDetails {\n    id\n    type\n    name\n    description\n    isPublic\n    workspaceId\n    projectId\n    parentMessageId\n    createdBy\n    memberCount\n    unreadCount\n    members {\n      userId\n      role\n      isMuted\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n    lastMessage {\n      id\n      content\n      authorUserId\n      createdAt\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n": typeof types.ConversationDetailsFieldsFragmentDoc,
    "\n  query GetConversation($conversationId: ID!) {\n    getConversation(conversationId: $conversationId) {\n      ...ConversationDetailsFields\n    }\n  }\n": typeof types.GetConversationDocument,
    "\n  fragment ProjectFields on Project {\n    id\n    key\n    name\n    description\n    workspaceId\n    createdAt\n    updatedAt\n    members {\n      userId\n      role\n      joinedAt\n    }\n  }\n": typeof types.ProjectFieldsFragmentDoc,
    "\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      ...ProjectFields\n    }\n  }\n": typeof types.GetProjectDocument,
    "\n  query MyProjects($workspaceId: ID!) {\n    myProjects(workspaceId: $workspaceId) {\n      ...ProjectFields\n    }\n  }\n": typeof types.MyProjectsDocument,
    "\n  query GetProjectBySlug($workspaceId: ID!, $slug: String!) {\n    projectBySlug(workspaceId: $workspaceId, slug: $slug) {\n      ...ProjectFields\n    }\n  }\n": typeof types.GetProjectBySlugDocument,
    "\n  fragment SessionUser on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n": typeof types.SessionUserFragmentDoc,
    "\n  mutation SessionSyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n      email\n      fullName\n      avatarUrl\n    }\n  }": typeof types.SessionSyncUserDocument,
    "\n  query GetMe {\n    me {\n      ...SessionUser\n    }\n  }\n": typeof types.GetMeDocument,
    "\n  fragment UserFragment on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n": typeof types.UserFragmentFragmentDoc,
    "\n  fragment WorkspaceFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n  }\n": typeof types.WorkspaceFragmentFragmentDoc,
    "\n  query GetMyWorkspaces {\n    myWorkspaces {\n      ...WorkspaceFragment\n    }\n  }\n": typeof types.GetMyWorkspacesDocument,
    "\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...WorkspaceFragment\n    }\n  }\n": typeof types.GetWorkspaceBySlugDocument,
    "\n  mutation CheckChannelAvailability($input: CheckChannelAvailabilityInput!) {\n    checkChannelAvailability(input: $input) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n": typeof types.CheckChannelAvailabilityDocument,
    "\n  mutation CreateChannel($input: CreateChannelInput!) {\n    createChannel(input: $input) {\n      id\n      name\n      type\n      workspaceId\n      projectId\n    }\n  }\n": typeof types.CreateChannelDocument,
    "\n  mutation CreateProject($workspaceId: ID!, $input: CreateProjectInput!) {\n    createProject(workspaceId: $workspaceId, input: $input) {\n      ...ProjectFields\n    }\n  }\n": typeof types.CreateProjectDocument,
    "\n  mutation CheckSlug($workspaceId: ID!, $slug: String!) {\n    checkProjectSlugAvailability(workspaceId: $workspaceId, slug: $slug) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n": typeof types.CheckSlugDocument,
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
};
const documents: Documents = {
    "\n  fragment MessageRecoveryFields on ChatMessage {\n    id\n    streamId\n    sequence\n    conversationId\n    authorUserId\n    content\n    type\n    createdAt\n  }\n": types.MessageRecoveryFieldsFragmentDoc,
    "\n  query GetMissingMessages($conversationId: ID!, $afterSequence: Int!, $limit: Int) {\n    messagesDelta(conversationId: $conversationId, afterSequence: $afterSequence, limit: $limit) {\n      messages {\n        ...MessageRecoveryFields\n      }\n      hasMore\n      lastSequence\n    }\n  }\n": types.GetMissingMessagesDocument,
    "\n  query GetHistory($conversationId: ID!, $beforeSequence: Int!, $limit: Int) {\n    history(conversationId: $conversationId, beforeSequence: $beforeSequence, limit: $limit) {\n       messages {\n         ...MessageRecoveryFields\n       }\n       hasMore\n       minSequence\n    }\n  }\n": types.GetHistoryDocument,
    "\n  fragment ConversationEdgeFields on ConversationEdge {\n    id\n    type\n    name\n    description\n    isPublic\n    workspaceId\n    projectId\n    memberCount\n    unreadCount\n    lastMessage {\n      id\n      content\n      authorUserId\n      createdAt\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n": types.ConversationEdgeFieldsFragmentDoc,
    "\n  query GetUserConversations(\n    $workspaceId: ID!\n    $projectId: ID!\n    $type: ConversationType\n    $includeArchived: Boolean\n    $limit: Int\n    $cursor: String\n  ) {\n    getUserConversations(\n      workspaceId: $workspaceId\n      projectId: $projectId\n      type: $type\n      includeArchived: $includeArchived\n      limit: $limit\n      cursor: $cursor\n    ) {\n      edges {\n        ...ConversationEdgeFields\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n": types.GetUserConversationsDocument,
    "\n  fragment ConversationDetailsFields on ConversationDetails {\n    id\n    type\n    name\n    description\n    isPublic\n    workspaceId\n    projectId\n    parentMessageId\n    createdBy\n    memberCount\n    unreadCount\n    members {\n      userId\n      role\n      isMuted\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n    lastMessage {\n      id\n      content\n      authorUserId\n      createdAt\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n": types.ConversationDetailsFieldsFragmentDoc,
    "\n  query GetConversation($conversationId: ID!) {\n    getConversation(conversationId: $conversationId) {\n      ...ConversationDetailsFields\n    }\n  }\n": types.GetConversationDocument,
    "\n  fragment ProjectFields on Project {\n    id\n    key\n    name\n    description\n    workspaceId\n    createdAt\n    updatedAt\n    members {\n      userId\n      role\n      joinedAt\n    }\n  }\n": types.ProjectFieldsFragmentDoc,
    "\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      ...ProjectFields\n    }\n  }\n": types.GetProjectDocument,
    "\n  query MyProjects($workspaceId: ID!) {\n    myProjects(workspaceId: $workspaceId) {\n      ...ProjectFields\n    }\n  }\n": types.MyProjectsDocument,
    "\n  query GetProjectBySlug($workspaceId: ID!, $slug: String!) {\n    projectBySlug(workspaceId: $workspaceId, slug: $slug) {\n      ...ProjectFields\n    }\n  }\n": types.GetProjectBySlugDocument,
    "\n  fragment SessionUser on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n": types.SessionUserFragmentDoc,
    "\n  mutation SessionSyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n      email\n      fullName\n      avatarUrl\n    }\n  }": types.SessionSyncUserDocument,
    "\n  query GetMe {\n    me {\n      ...SessionUser\n    }\n  }\n": types.GetMeDocument,
    "\n  fragment UserFragment on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n": types.UserFragmentFragmentDoc,
    "\n  fragment WorkspaceFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n  }\n": types.WorkspaceFragmentFragmentDoc,
    "\n  query GetMyWorkspaces {\n    myWorkspaces {\n      ...WorkspaceFragment\n    }\n  }\n": types.GetMyWorkspacesDocument,
    "\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...WorkspaceFragment\n    }\n  }\n": types.GetWorkspaceBySlugDocument,
    "\n  mutation CheckChannelAvailability($input: CheckChannelAvailabilityInput!) {\n    checkChannelAvailability(input: $input) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n": types.CheckChannelAvailabilityDocument,
    "\n  mutation CreateChannel($input: CreateChannelInput!) {\n    createChannel(input: $input) {\n      id\n      name\n      type\n      workspaceId\n      projectId\n    }\n  }\n": types.CreateChannelDocument,
    "\n  mutation CreateProject($workspaceId: ID!, $input: CreateProjectInput!) {\n    createProject(workspaceId: $workspaceId, input: $input) {\n      ...ProjectFields\n    }\n  }\n": types.CreateProjectDocument,
    "\n  mutation CheckSlug($workspaceId: ID!, $slug: String!) {\n    checkProjectSlugAvailability(workspaceId: $workspaceId, slug: $slug) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n": types.CheckSlugDocument,
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
export function gql(source: "\n  fragment MessageRecoveryFields on ChatMessage {\n    id\n    streamId\n    sequence\n    conversationId\n    authorUserId\n    content\n    type\n    createdAt\n  }\n"): (typeof documents)["\n  fragment MessageRecoveryFields on ChatMessage {\n    id\n    streamId\n    sequence\n    conversationId\n    authorUserId\n    content\n    type\n    createdAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMissingMessages($conversationId: ID!, $afterSequence: Int!, $limit: Int) {\n    messagesDelta(conversationId: $conversationId, afterSequence: $afterSequence, limit: $limit) {\n      messages {\n        ...MessageRecoveryFields\n      }\n      hasMore\n      lastSequence\n    }\n  }\n"): (typeof documents)["\n  query GetMissingMessages($conversationId: ID!, $afterSequence: Int!, $limit: Int) {\n    messagesDelta(conversationId: $conversationId, afterSequence: $afterSequence, limit: $limit) {\n      messages {\n        ...MessageRecoveryFields\n      }\n      hasMore\n      lastSequence\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetHistory($conversationId: ID!, $beforeSequence: Int!, $limit: Int) {\n    history(conversationId: $conversationId, beforeSequence: $beforeSequence, limit: $limit) {\n       messages {\n         ...MessageRecoveryFields\n       }\n       hasMore\n       minSequence\n    }\n  }\n"): (typeof documents)["\n  query GetHistory($conversationId: ID!, $beforeSequence: Int!, $limit: Int) {\n    history(conversationId: $conversationId, beforeSequence: $beforeSequence, limit: $limit) {\n       messages {\n         ...MessageRecoveryFields\n       }\n       hasMore\n       minSequence\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ConversationEdgeFields on ConversationEdge {\n    id\n    type\n    name\n    description\n    isPublic\n    workspaceId\n    projectId\n    memberCount\n    unreadCount\n    lastMessage {\n      id\n      content\n      authorUserId\n      createdAt\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n"): (typeof documents)["\n  fragment ConversationEdgeFields on ConversationEdge {\n    id\n    type\n    name\n    description\n    isPublic\n    workspaceId\n    projectId\n    memberCount\n    unreadCount\n    lastMessage {\n      id\n      content\n      authorUserId\n      createdAt\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserConversations(\n    $workspaceId: ID!\n    $projectId: ID!\n    $type: ConversationType\n    $includeArchived: Boolean\n    $limit: Int\n    $cursor: String\n  ) {\n    getUserConversations(\n      workspaceId: $workspaceId\n      projectId: $projectId\n      type: $type\n      includeArchived: $includeArchived\n      limit: $limit\n      cursor: $cursor\n    ) {\n      edges {\n        ...ConversationEdgeFields\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserConversations(\n    $workspaceId: ID!\n    $projectId: ID!\n    $type: ConversationType\n    $includeArchived: Boolean\n    $limit: Int\n    $cursor: String\n  ) {\n    getUserConversations(\n      workspaceId: $workspaceId\n      projectId: $projectId\n      type: $type\n      includeArchived: $includeArchived\n      limit: $limit\n      cursor: $cursor\n    ) {\n      edges {\n        ...ConversationEdgeFields\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ConversationDetailsFields on ConversationDetails {\n    id\n    type\n    name\n    description\n    isPublic\n    workspaceId\n    projectId\n    parentMessageId\n    createdBy\n    memberCount\n    unreadCount\n    members {\n      userId\n      role\n      isMuted\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n    lastMessage {\n      id\n      content\n      authorUserId\n      createdAt\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n"): (typeof documents)["\n  fragment ConversationDetailsFields on ConversationDetails {\n    id\n    type\n    name\n    description\n    isPublic\n    workspaceId\n    projectId\n    parentMessageId\n    createdBy\n    memberCount\n    unreadCount\n    members {\n      userId\n      role\n      isMuted\n      joinedAt\n      user {\n        id\n        fullName\n        email\n        avatarUrl\n      }\n    }\n    lastMessage {\n      id\n      content\n      authorUserId\n      createdAt\n    }\n    createdAt\n    updatedAt\n    deletedAt\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetConversation($conversationId: ID!) {\n    getConversation(conversationId: $conversationId) {\n      ...ConversationDetailsFields\n    }\n  }\n"): (typeof documents)["\n  query GetConversation($conversationId: ID!) {\n    getConversation(conversationId: $conversationId) {\n      ...ConversationDetailsFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment ProjectFields on Project {\n    id\n    key\n    name\n    description\n    workspaceId\n    createdAt\n    updatedAt\n    members {\n      userId\n      role\n      joinedAt\n    }\n  }\n"): (typeof documents)["\n  fragment ProjectFields on Project {\n    id\n    key\n    name\n    description\n    workspaceId\n    createdAt\n    updatedAt\n    members {\n      userId\n      role\n      joinedAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      ...ProjectFields\n    }\n  }\n"): (typeof documents)["\n  query GetProject($id: ID!) {\n    project(id: $id) {\n      ...ProjectFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query MyProjects($workspaceId: ID!) {\n    myProjects(workspaceId: $workspaceId) {\n      ...ProjectFields\n    }\n  }\n"): (typeof documents)["\n  query MyProjects($workspaceId: ID!) {\n    myProjects(workspaceId: $workspaceId) {\n      ...ProjectFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetProjectBySlug($workspaceId: ID!, $slug: String!) {\n    projectBySlug(workspaceId: $workspaceId, slug: $slug) {\n      ...ProjectFields\n    }\n  }\n"): (typeof documents)["\n  query GetProjectBySlug($workspaceId: ID!, $slug: String!) {\n    projectBySlug(workspaceId: $workspaceId, slug: $slug) {\n      ...ProjectFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment SessionUser on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n"): (typeof documents)["\n  fragment SessionUser on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation SessionSyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n      email\n      fullName\n      avatarUrl\n    }\n  }"): (typeof documents)["\n  mutation SessionSyncUser(\n    $clerkId: String!\n    $email: String!\n    $fullName: String\n    $avatarUrl: String\n  ) {\n    syncUser(\n      clerkId: $clerkId\n      email: $email\n      fullName: $fullName\n      avatarUrl: $avatarUrl\n    ) {\n      id\n      email\n      fullName\n      avatarUrl\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMe {\n    me {\n      ...SessionUser\n    }\n  }\n"): (typeof documents)["\n  query GetMe {\n    me {\n      ...SessionUser\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment UserFragment on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n"): (typeof documents)["\n  fragment UserFragment on User {\n    id\n    email\n    fullName\n    avatarUrl\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  fragment WorkspaceFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n  }\n"): (typeof documents)["\n  fragment WorkspaceFragment on Workspace {\n    id\n    name\n    slug\n    logoUrl\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetMyWorkspaces {\n    myWorkspaces {\n      ...WorkspaceFragment\n    }\n  }\n"): (typeof documents)["\n  query GetMyWorkspaces {\n    myWorkspaces {\n      ...WorkspaceFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...WorkspaceFragment\n    }\n  }\n"): (typeof documents)["\n  query GetWorkspaceBySlug($slug: String!) {\n    workspaceBySlug(slug: $slug) {\n      ...WorkspaceFragment\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CheckChannelAvailability($input: CheckChannelAvailabilityInput!) {\n    checkChannelAvailability(input: $input) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n"): (typeof documents)["\n  mutation CheckChannelAvailability($input: CheckChannelAvailabilityInput!) {\n    checkChannelAvailability(input: $input) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateChannel($input: CreateChannelInput!) {\n    createChannel(input: $input) {\n      id\n      name\n      type\n      workspaceId\n      projectId\n    }\n  }\n"): (typeof documents)["\n  mutation CreateChannel($input: CreateChannelInput!) {\n    createChannel(input: $input) {\n      id\n      name\n      type\n      workspaceId\n      projectId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateProject($workspaceId: ID!, $input: CreateProjectInput!) {\n    createProject(workspaceId: $workspaceId, input: $input) {\n      ...ProjectFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProject($workspaceId: ID!, $input: CreateProjectInput!) {\n    createProject(workspaceId: $workspaceId, input: $input) {\n      ...ProjectFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CheckSlug($workspaceId: ID!, $slug: String!) {\n    checkProjectSlugAvailability(workspaceId: $workspaceId, slug: $slug) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n"): (typeof documents)["\n  mutation CheckSlug($workspaceId: ID!, $slug: String!) {\n    checkProjectSlugAvailability(workspaceId: $workspaceId, slug: $slug) {\n      available\n      message\n      reason\n      reservationId\n    }\n  }\n"];
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

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;