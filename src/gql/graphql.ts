/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AcceptInviteInput = {
  token: Scalars['String']['input'];
  userEmail?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type AddChannelMembersResult = {
  __typename?: 'AddChannelMembersResult';
  addedCount: Scalars['Int']['output'];
  members: Array<ChannelMemberInfo>;
  skippedCount: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
};

export type AddGroupMembersResult = {
  __typename?: 'AddGroupMembersResult';
  addedCount: Scalars['Int']['output'];
  members: Array<GroupMemberInfo>;
  skippedCount: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
};

export type ArchiveChannelInput = {
  channelId: Scalars['ID']['input'];
};

export type AvailabilityResponse = {
  __typename?: 'AvailabilityResponse';
  available: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  reservationId?: Maybe<Scalars['String']['output']>;
};

export type ChannelAvailabilityResponse = {
  __typename?: 'ChannelAvailabilityResponse';
  available: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  reservationId?: Maybe<Scalars['String']['output']>;
};

export type ChannelMemberInfo = {
  __typename?: 'ChannelMemberInfo';
  user: UserBasic;
  userId: Scalars['ID']['output'];
};

export type ChatMemberRecord = {
  __typename?: 'ChatMemberRecord';
  conversationId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  isMuted: Scalars['Boolean']['output'];
  joinedAt: Scalars['DateTime']['output'];
  lastDeliveredMsgId?: Maybe<Scalars['ID']['output']>;
  lastReadMsgId?: Maybe<Scalars['ID']['output']>;
  role: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type ChatMessage = {
  __typename?: 'ChatMessage';
  authorUserId: Scalars['ID']['output'];
  content: Scalars['JSON']['output'];
  conversationId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  editedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isEdited: Scalars['Boolean']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  parentMessageId?: Maybe<Scalars['ID']['output']>;
  replyCount: Scalars['Int']['output'];
  sequence: Scalars['Int']['output'];
  streamId: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type CheckChannelAvailabilityInput = {
  projectId: Scalars['ID']['input'];
  slug: Scalars['String']['input'];
};

export type CloseThreadResult = {
  __typename?: 'CloseThreadResult';
  closedAt: Scalars['DateTime']['output'];
  success: Scalars['Boolean']['output'];
  threadId: Scalars['ID']['output'];
};

export type Conversation = {
  __typename?: 'Conversation';
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<Scalars['ID']['output']>;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isArchived: Scalars['Boolean']['output'];
  isPublic: Scalars['Boolean']['output'];
  lastMessage?: Maybe<LastMessagePreview>;
  memberCount: Scalars['Int']['output'];
  members?: Maybe<Array<ConversationMember>>;
  name?: Maybe<Scalars['String']['output']>;
  parentMessageId?: Maybe<Scalars['ID']['output']>;
  projectId?: Maybe<Scalars['ID']['output']>;
  topic?: Maybe<Scalars['String']['output']>;
  type: ConversationType;
  unreadCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  workspaceId: Scalars['ID']['output'];
};

export type ConversationConnection = {
  __typename?: 'ConversationConnection';
  edges: Array<Conversation>;
  pageInfo: PageInfo;
};

export type ConversationMember = {
  __typename?: 'ConversationMember';
  isMuted: Scalars['Boolean']['output'];
  joinedAt: Scalars['DateTime']['output'];
  role: Scalars['String']['output'];
  user: UserBasic;
  userId: Scalars['ID']['output'];
};

export enum ConversationType {
  Channel = 'CHANNEL',
  Dm = 'DM',
  GroupDm = 'GROUP_DM',
  Thread = 'THREAD'
}

export type ConversationUnreadCount = {
  __typename?: 'ConversationUnreadCount';
  conversationId: Scalars['ID']['output'];
  lastUnreadMessageId?: Maybe<Scalars['ID']['output']>;
  unreadCount: Scalars['Int']['output'];
};

export type CreateChannelInput = {
  memberUserIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  topic?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<ConversationType>;
  workspaceId: Scalars['ID']['input'];
};

export type CreateDmInput = {
  projectId: Scalars['ID']['input'];
  recipientUserId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};

export type CreateGroupInput = {
  memberUserIds: Array<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};

export type CreateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type CreateThreadInput = {
  conversationId: Scalars['ID']['input'];
  messageId: Scalars['ID']['input'];
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};

export type DeleteChannelResult = {
  __typename?: 'DeleteChannelResult';
  channelId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
};

export type DeleteDmResult = {
  __typename?: 'DeleteDmResult';
  dmId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
};

export type DeleteGroupResult = {
  __typename?: 'DeleteGroupResult';
  groupId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
};

export type DeleteThreadResult = {
  __typename?: 'DeleteThreadResult';
  success: Scalars['Boolean']['output'];
  threadId: Scalars['ID']['output'];
};

export type DmConversation = {
  __typename?: 'DmConversation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  memberCount: Scalars['Int']['output'];
  members: Array<DmMember>;
  projectId: Scalars['ID']['output'];
  type: ConversationType;
  updatedAt: Scalars['DateTime']['output'];
  workspaceId: Scalars['ID']['output'];
};

export type DmMember = {
  __typename?: 'DmMember';
  user: UserBasic;
  userId: Scalars['ID']['output'];
};

export type GroupMemberInfo = {
  __typename?: 'GroupMemberInfo';
  user: UserBasic;
  userId: Scalars['ID']['output'];
};

export type HistoryPayload = {
  __typename?: 'HistoryPayload';
  hasMore: Scalars['Boolean']['output'];
  messages: Array<ChatMessage>;
  minSequence?: Maybe<Scalars['Int']['output']>;
};

export type InviteResponse = {
  __typename?: 'InviteResponse';
  invitedCount: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type InviteToWorkspaceInput = {
  emails: Array<Scalars['String']['input']>;
  workspaceId: Scalars['ID']['input'];
};

export type JoinResponse = {
  __typename?: 'JoinResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  workspaceSlug: Scalars['String']['output'];
};

export type LastMessagePreview = {
  __typename?: 'LastMessagePreview';
  authorUserId: Scalars['ID']['output'];
  content: Scalars['JSON']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
};

export type LeaveGroupResult = {
  __typename?: 'LeaveGroupResult';
  groupId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
};

export type MessageReaction = {
  __typename?: 'MessageReaction';
  count: Scalars['Int']['output'];
  emoji: Scalars['String']['output'];
  hasReacted: Scalars['Boolean']['output'];
  recentUsers: Array<User>;
};

export type MessagesDelta = {
  __typename?: 'MessagesDelta';
  hasMore: Scalars['Boolean']['output'];
  lastSequence: Scalars['Int']['output'];
  messages: Array<ChatMessage>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _health?: Maybe<Scalars['String']['output']>;
  acceptWorkspaceInvite: JoinResponse;
  addChannelMembers: AddChannelMembersResult;
  addGroupMembers: AddGroupMembersResult;
  archiveChannel: Conversation;
  checkChannelAvailability: ChannelAvailabilityResponse;
  checkProjectSlugAvailability: AvailabilityResponse;
  checkSlugAvailability: AvailabilityResponse;
  closeThread: CloseThreadResult;
  createChannel: Conversation;
  createDm: Conversation;
  createGroup: Conversation;
  createOnboardingWorkspace: Workspace;
  createProject: Project;
  createThread: Conversation;
  createWorkspace: Workspace;
  deleteChannel: DeleteChannelResult;
  deleteDm: DeleteDmResult;
  deleteGroup: DeleteGroupResult;
  deleteThread: DeleteThreadResult;
  inviteToWorkspace: InviteResponse;
  leaveGroup: LeaveGroupResult;
  /** Mark all notifications as read. */
  markAllNotificationsRead: Scalars['Boolean']['output'];
  /** Mark specific notifications as read. */
  markNotificationRead: Scalars['Boolean']['output'];
  muteConversation: MuteConversationResult;
  removeChannelMember: RemoveChannelMemberResult;
  removeGroupMember: RemoveGroupMemberResult;
  removeWorkspaceMember: InviteResponse;
  renameChannel: Conversation;
  renameGroup: RenameGroupResult;
  reopenThread: ReopenThreadResult;
  subscribeThread: SubscribeThreadResult;
  syncUser: User;
  unarchiveChannel: UnarchiveChannelResult;
  unsubscribeThread: UnsubscribeThreadResult;
  updateChannelDescription: UpdateChannelDescriptionResult;
  updateChannelVisibility: UpdateChannelVisibilityResult;
  updateWorkspaceMemberRole: WorkspaceMember;
};


export type MutationAcceptWorkspaceInviteArgs = {
  input: AcceptInviteInput;
};


export type MutationAddChannelMembersArgs = {
  channelId: Scalars['ID']['input'];
  userIds: Array<Scalars['ID']['input']>;
  workspaceId: Scalars['ID']['input'];
};


export type MutationAddGroupMembersArgs = {
  groupId: Scalars['ID']['input'];
  userIds: Array<Scalars['ID']['input']>;
  workspaceId: Scalars['ID']['input'];
};


export type MutationArchiveChannelArgs = {
  input: ArchiveChannelInput;
};


export type MutationCheckChannelAvailabilityArgs = {
  input: CheckChannelAvailabilityInput;
};


export type MutationCheckProjectSlugAvailabilityArgs = {
  slug: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationCheckSlugAvailabilityArgs = {
  slug: Scalars['String']['input'];
};


export type MutationCloseThreadArgs = {
  threadId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationCreateChannelArgs = {
  input: CreateChannelInput;
};


export type MutationCreateDmArgs = {
  input: CreateDmInput;
};


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
  workspaceId: Scalars['ID']['input'];
};


export type MutationCreateThreadArgs = {
  input: CreateThreadInput;
};


export type MutationCreateWorkspaceArgs = {
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};


export type MutationDeleteChannelArgs = {
  channelId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationDeleteDmArgs = {
  dmId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationDeleteGroupArgs = {
  groupId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationDeleteThreadArgs = {
  threadId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationInviteToWorkspaceArgs = {
  input: InviteToWorkspaceInput;
};


export type MutationLeaveGroupArgs = {
  groupId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationMarkNotificationReadArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationMuteConversationArgs = {
  conversationId: Scalars['ID']['input'];
  isMuted: Scalars['Boolean']['input'];
};


export type MutationRemoveChannelMemberArgs = {
  channelId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationRemoveGroupMemberArgs = {
  groupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationRemoveWorkspaceMemberArgs = {
  memberId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationRenameChannelArgs = {
  input: RenameChannelInput;
};


export type MutationRenameGroupArgs = {
  groupId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationReopenThreadArgs = {
  threadId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationSubscribeThreadArgs = {
  threadId: Scalars['ID']['input'];
};


export type MutationSyncUserArgs = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  clerkId: Scalars['String']['input'];
  email: Scalars['String']['input'];
  emailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUnarchiveChannelArgs = {
  channelId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationUnsubscribeThreadArgs = {
  threadId: Scalars['ID']['input'];
};


export type MutationUpdateChannelDescriptionArgs = {
  channelId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  workspaceId: Scalars['ID']['input'];
};


export type MutationUpdateChannelVisibilityArgs = {
  channelId: Scalars['ID']['input'];
  isPublic: Scalars['Boolean']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationUpdateWorkspaceMemberRoleArgs = {
  memberId: Scalars['ID']['input'];
  role: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};

export type MuteConversationResult = {
  __typename?: 'MuteConversationResult';
  conversationId: Scalars['ID']['output'];
  isMuted: Scalars['Boolean']['output'];
  success: Scalars['Boolean']['output'];
};

export type Notification = {
  __typename?: 'Notification';
  actor?: Maybe<User>;
  actorId?: Maybe<Scalars['String']['output']>;
  category: Scalars['String']['output'];
  chatMessage?: Maybe<ChatMessage>;
  createdAt: Scalars['DateTime']['output'];
  data?: Maybe<Scalars['JSON']['output']>;
  entityId: Scalars['String']['output'];
  entityType: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isArchived: Scalars['Boolean']['output'];
  isRead: Scalars['Boolean']['output'];
  page?: Maybe<Page>;
  project?: Maybe<Project>;
  recipientUserId: Scalars['String']['output'];
  task?: Maybe<Task>;
  workspace?: Maybe<Workspace>;
};

export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  edges: Array<NotificationEdge>;
  pageInfo: PageInfo;
};

export type NotificationEdge = {
  __typename?: 'NotificationEdge';
  cursor: Scalars['String']['output'];
  node: Notification;
};

export type OnboardingStatus = {
  __typename?: 'OnboardingStatus';
  hasProject: Scalars['Boolean']['output'];
  hasUser: Scalars['Boolean']['output'];
  hasWorkspace: Scalars['Boolean']['output'];
  workspaceSlug?: Maybe<Scalars['String']['output']>;
};

export type Page = {
  __typename?: 'Page';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export enum PresenceStatus {
  Away = 'AWAY',
  Offline = 'OFFLINE',
  Online = 'ONLINE'
}

export type Project = {
  __typename?: 'Project';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isArchived?: Maybe<Scalars['Boolean']['output']>;
  isPrivate?: Maybe<Scalars['Boolean']['output']>;
  key: Scalars['String']['output'];
  members: Array<ProjectMember>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  workspaceId: Scalars['String']['output'];
};

export type ProjectMember = {
  __typename?: 'ProjectMember';
  id: Scalars['ID']['output'];
  joinedAt: Scalars['String']['output'];
  role?: Maybe<Scalars['String']['output']>;
  user: User;
  userId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  getChannelMembers: Array<ChatMemberRecord>;
  getConversation: Conversation;
  getDmByUsers?: Maybe<DmConversation>;
  getLastReadMessage?: Maybe<Scalars['ID']['output']>;
  getMessageById?: Maybe<ChatMessage>;
  getMessagesAfterCursor: Array<ChatMessage>;
  getMissingMessages: Array<ChatMessage>;
  getReadReceipts: ReadReceiptsResponse;
  getThreadMessages: Array<ChatMessage>;
  getUnreadCounts: UnreadCountsResponse;
  getUserConversations: ConversationConnection;
  getUsersByIds: Array<UserBasic>;
  getWorkspaceInviteInfo: WorkspaceInviteInfo;
  health: Scalars['String']['output'];
  history: HistoryPayload;
  me?: Maybe<User>;
  messageReactions: Array<MessageReaction>;
  messagesDelta: MessagesDelta;
  myProjects: Array<Project>;
  myWorkspaces: Array<Workspace>;
  /** Get paginated notifications for the current user. */
  notifications: NotificationConnection;
  onboardingStatus: OnboardingStatus;
  project?: Maybe<Project>;
  projectBySlug?: Maybe<Project>;
  reactionUsers: ReactionUsersConnection;
  /** Get count of unread notifications. */
  unreadNotificationCount: Scalars['Int']['output'];
  workspaceBySlug: Workspace;
  workspaceMembers: Array<WorkspaceMember>;
};


export type QueryGetChannelMembersArgs = {
  channelId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetConversationArgs = {
  conversationId: Scalars['ID']['input'];
};


export type QueryGetDmByUsersArgs = {
  otherUserId: Scalars['ID']['input'];
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type QueryGetLastReadMessageArgs = {
  channelId: Scalars['ID']['input'];
};


export type QueryGetMessageByIdArgs = {
  messageId: Scalars['ID']['input'];
};


export type QueryGetMessagesAfterCursorArgs = {
  afterCursor: Scalars['ID']['input'];
  channelId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetMissingMessagesArgs = {
  channelId: Scalars['ID']['input'];
  rangeEnd: Scalars['ID']['input'];
  rangeStart: Scalars['ID']['input'];
};


export type QueryGetReadReceiptsArgs = {
  messageId: Scalars['ID']['input'];
};


export type QueryGetThreadMessagesArgs = {
  beforeCursor?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  parentMessageId: Scalars['ID']['input'];
};


export type QueryGetUnreadCountsArgs = {
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type QueryGetUserConversationsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  includeArchived?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  projectId: Scalars['ID']['input'];
  type?: InputMaybe<ConversationType>;
  workspaceId: Scalars['ID']['input'];
};


export type QueryGetUsersByIdsArgs = {
  userIds: Array<Scalars['ID']['input']>;
};


export type QueryGetWorkspaceInviteInfoArgs = {
  token: Scalars['String']['input'];
};


export type QueryHistoryArgs = {
  beforeSequence: Scalars['Int']['input'];
  conversationId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMessageReactionsArgs = {
  messageId: Scalars['ID']['input'];
};


export type QueryMessagesDeltaArgs = {
  afterSequence?: InputMaybe<Scalars['Int']['input']>;
  afterStreamId?: InputMaybe<Scalars['String']['input']>;
  conversationId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMyProjectsArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type QueryNotificationsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProjectArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProjectBySlugArgs = {
  slug: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type QueryReactionUsersArgs = {
  cursor?: InputMaybe<Scalars['Int']['input']>;
  emoji: Scalars['String']['input'];
  messageId: Scalars['ID']['input'];
};


export type QueryWorkspaceBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryWorkspaceMembersArgs = {
  workspaceId: Scalars['ID']['input'];
};

export type ReactionUsersConnection = {
  __typename?: 'ReactionUsersConnection';
  nextCursor?: Maybe<Scalars['Int']['output']>;
  users: Array<User>;
};

export type ReadReceiptUser = {
  __typename?: 'ReadReceiptUser';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

export type ReadReceiptsResponse = {
  __typename?: 'ReadReceiptsResponse';
  readBy: Array<ReadReceiptUser>;
  totalMembers: Scalars['Int']['output'];
  totalReads: Scalars['Int']['output'];
};

export type RemoveChannelMemberResult = {
  __typename?: 'RemoveChannelMemberResult';
  channelId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
  userId: Scalars['ID']['output'];
};

export type RemoveGroupMemberResult = {
  __typename?: 'RemoveGroupMemberResult';
  groupId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
  userId: Scalars['ID']['output'];
};

export type RenameChannelInput = {
  channelId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type RenameGroupResult = {
  __typename?: 'RenameGroupResult';
  groupId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type ReopenThreadResult = {
  __typename?: 'ReopenThreadResult';
  success: Scalars['Boolean']['output'];
  threadId: Scalars['ID']['output'];
};

export type SubscribeThreadResult = {
  __typename?: 'SubscribeThreadResult';
  isSubscribed: Scalars['Boolean']['output'];
  success: Scalars['Boolean']['output'];
  threadId: Scalars['ID']['output'];
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['ID']['output'];
  statusName: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type UnarchiveChannelResult = {
  __typename?: 'UnarchiveChannelResult';
  channelId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UnreadCountsResponse = {
  __typename?: 'UnreadCountsResponse';
  conversations: Array<ConversationUnreadCount>;
};

export type UnsubscribeThreadResult = {
  __typename?: 'UnsubscribeThreadResult';
  isSubscribed: Scalars['Boolean']['output'];
  success: Scalars['Boolean']['output'];
  threadId: Scalars['ID']['output'];
};

export type UpdateChannelDescriptionResult = {
  __typename?: 'UpdateChannelDescriptionResult';
  channelId: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UpdateChannelVisibilityResult = {
  __typename?: 'UpdateChannelVisibilityResult';
  channelId: Scalars['ID']['output'];
  isPublic: Scalars['Boolean']['output'];
  success: Scalars['Boolean']['output'];
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  fullName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type UserBasic = {
  __typename?: 'UserBasic';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type UserPresence = {
  __typename?: 'UserPresence';
  lastActiveAt?: Maybe<Scalars['DateTime']['output']>;
  status: PresenceStatus;
  userId: Scalars['ID']['output'];
};

export type Workspace = {
  __typename?: 'Workspace';
  createdAt: Scalars['String']['output'];
  domainWhitelist?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type WorkspaceInviteInfo = {
  __typename?: 'WorkspaceInviteInfo';
  inviterName?: Maybe<Scalars['String']['output']>;
  workspaceLogoUrl?: Maybe<Scalars['String']['output']>;
  workspaceName: Scalars['String']['output'];
};

export type WorkspaceMember = {
  __typename?: 'WorkspaceMember';
  id: Scalars['ID']['output'];
  joinedAt: Scalars['String']['output'];
  role: Scalars['String']['output'];
  user: User;
};

export type MessageRecoveryFieldsFragment = { __typename?: 'ChatMessage', id: string, streamId: string, sequence: number, conversationId: string, authorUserId: string, content: any, type: string, createdAt: any } & { ' $fragmentName'?: 'MessageRecoveryFieldsFragment' };

export type GetMissingMessagesQueryVariables = Exact<{
  conversationId: Scalars['ID']['input'];
  afterSequence: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMissingMessagesQuery = { __typename?: 'Query', messagesDelta: { __typename?: 'MessagesDelta', hasMore: boolean, lastSequence: number, messages: Array<(
      { __typename?: 'ChatMessage' }
      & { ' $fragmentRefs'?: { 'MessageRecoveryFieldsFragment': MessageRecoveryFieldsFragment } }
    )> } };

export type GetHistoryQueryVariables = Exact<{
  conversationId: Scalars['ID']['input'];
  beforeSequence: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetHistoryQuery = { __typename?: 'Query', history: { __typename?: 'HistoryPayload', hasMore: boolean, minSequence?: number | null, messages: Array<(
      { __typename?: 'ChatMessage' }
      & { ' $fragmentRefs'?: { 'MessageRecoveryFieldsFragment': MessageRecoveryFieldsFragment } }
    )> } };

export type ConversationFieldsFragment = { __typename?: 'Conversation', id: string, type: ConversationType, name?: string | null, topic?: string | null, isPublic: boolean, workspaceId: string, projectId?: string | null, parentMessageId?: string | null, createdBy?: string | null, isArchived: boolean, memberCount: number, unreadCount: number, createdAt: any, updatedAt: any, deletedAt?: any | null, description?: string | null, lastMessage?: { __typename?: 'LastMessagePreview', id: string, content: any, authorUserId: string, createdAt: any } | null } & { ' $fragmentName'?: 'ConversationFieldsFragment' };

export type ConversationMemberFieldsFragment = { __typename?: 'ConversationMember', userId: string, role: string, isMuted: boolean, joinedAt: any, user: { __typename?: 'UserBasic', id: string, fullName: string, email: string, avatarUrl?: string | null } } & { ' $fragmentName'?: 'ConversationMemberFieldsFragment' };

export type GetUserConversationsQueryVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
  projectId: Scalars['ID']['input'];
  type?: InputMaybe<ConversationType>;
  includeArchived?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUserConversationsQuery = { __typename?: 'Query', getUserConversations: { __typename?: 'ConversationConnection', edges: Array<(
      { __typename?: 'Conversation' }
      & { ' $fragmentRefs'?: { 'ConversationFieldsFragment': ConversationFieldsFragment } }
    )>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null } } };

export type GetConversationQueryVariables = Exact<{
  conversationId: Scalars['ID']['input'];
}>;


export type GetConversationQuery = { __typename?: 'Query', getConversation: (
    { __typename?: 'Conversation', members?: Array<(
      { __typename?: 'ConversationMember' }
      & { ' $fragmentRefs'?: { 'ConversationMemberFieldsFragment': ConversationMemberFieldsFragment } }
    )> | null }
    & { ' $fragmentRefs'?: { 'ConversationFieldsFragment': ConversationFieldsFragment } }
  ) };

export type GetUsersByIdsQueryVariables = Exact<{
  userIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type GetUsersByIdsQuery = { __typename?: 'Query', getUsersByIds: Array<{ __typename?: 'UserBasic', id: string, fullName: string, email: string, avatarUrl?: string | null }> };

export type ProjectFieldsFragment = { __typename?: 'Project', id: string, key: string, name: string, description?: string | null, workspaceId: string, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'ProjectMember', userId: string, role?: string | null, joinedAt: string }> } & { ' $fragmentName'?: 'ProjectFieldsFragment' };

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetProjectQuery = { __typename?: 'Query', project?: (
    { __typename?: 'Project' }
    & { ' $fragmentRefs'?: { 'ProjectFieldsFragment': ProjectFieldsFragment } }
  ) | null };

export type MyProjectsQueryVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
}>;


export type MyProjectsQuery = { __typename?: 'Query', myProjects: Array<(
    { __typename?: 'Project' }
    & { ' $fragmentRefs'?: { 'ProjectFieldsFragment': ProjectFieldsFragment } }
  )> };

export type GetProjectBySlugQueryVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
  slug: Scalars['String']['input'];
}>;


export type GetProjectBySlugQuery = { __typename?: 'Query', projectBySlug?: (
    { __typename?: 'Project' }
    & { ' $fragmentRefs'?: { 'ProjectFieldsFragment': ProjectFieldsFragment } }
  ) | null };

export type SessionUserFragment = { __typename?: 'User', id: string, email: string, fullName?: string | null, avatarUrl?: string | null } & { ' $fragmentName'?: 'SessionUserFragment' };

export type SessionSyncUserMutationVariables = Exact<{
  clerkId: Scalars['String']['input'];
  email: Scalars['String']['input'];
  fullName?: InputMaybe<Scalars['String']['input']>;
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
}>;


export type SessionSyncUserMutation = { __typename?: 'Mutation', syncUser: { __typename?: 'User', id: string, email: string, fullName?: string | null, avatarUrl?: string | null } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'SessionUserFragment': SessionUserFragment } }
  ) | null };

export type UserFragmentFragment = { __typename?: 'User', id: string, email: string, fullName?: string | null, avatarUrl?: string | null } & { ' $fragmentName'?: 'UserFragmentFragment' };

export type WorkspaceFragmentFragment = { __typename?: 'Workspace', id: string, name: string, slug: string, logoUrl?: string | null } & { ' $fragmentName'?: 'WorkspaceFragmentFragment' };

export type GetMyWorkspacesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyWorkspacesQuery = { __typename?: 'Query', myWorkspaces: Array<(
    { __typename?: 'Workspace' }
    & { ' $fragmentRefs'?: { 'WorkspaceFragmentFragment': WorkspaceFragmentFragment } }
  )> };

export type GetWorkspaceBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetWorkspaceBySlugQuery = { __typename?: 'Query', workspaceBySlug: (
    { __typename?: 'Workspace' }
    & { ' $fragmentRefs'?: { 'WorkspaceFragmentFragment': WorkspaceFragmentFragment } }
  ) };

export type ArchiveChannelMutationVariables = Exact<{
  input: ArchiveChannelInput;
}>;


export type ArchiveChannelMutation = { __typename?: 'Mutation', archiveChannel: { __typename?: 'Conversation', id: string, name?: string | null, type: ConversationType, isArchived: boolean, deletedAt?: any | null, workspaceId: string, projectId?: string | null, updatedAt: any } };

export type CheckChannelAvailabilityMutationVariables = Exact<{
  input: CheckChannelAvailabilityInput;
}>;


export type CheckChannelAvailabilityMutation = { __typename?: 'Mutation', checkChannelAvailability: { __typename?: 'ChannelAvailabilityResponse', available: boolean, message?: string | null, reason?: string | null, reservationId?: string | null } };

export type CreateChannelMutationVariables = Exact<{
  input: CreateChannelInput;
}>;


export type CreateChannelMutation = { __typename?: 'Mutation', createChannel: { __typename?: 'Conversation', id: string, name?: string | null, type: ConversationType, workspaceId: string, projectId?: string | null } };

export type DeleteChannelMutationVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
  channelId: Scalars['ID']['input'];
}>;


export type DeleteChannelMutation = { __typename?: 'Mutation', deleteChannel: { __typename?: 'DeleteChannelResult', success: boolean, channelId: string } };

export type RenameChannelMutationVariables = Exact<{
  input: RenameChannelInput;
}>;


export type RenameChannelMutation = { __typename?: 'Mutation', renameChannel: { __typename?: 'Conversation', id: string, name?: string | null, type: ConversationType, workspaceId: string, projectId?: string | null, updatedAt: any } };

export type UnarchiveChannelMutationVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
  channelId: Scalars['ID']['input'];
}>;


export type UnarchiveChannelMutation = { __typename?: 'Mutation', unarchiveChannel: { __typename?: 'UnarchiveChannelResult', success: boolean, channelId: string, name: string } };

export type CreateProjectMutationVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: (
    { __typename?: 'Project' }
    & { ' $fragmentRefs'?: { 'ProjectFieldsFragment': ProjectFieldsFragment } }
  ) };

export type CheckSlugMutationVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
  slug: Scalars['String']['input'];
}>;


export type CheckSlugMutation = { __typename?: 'Mutation', checkProjectSlugAvailability: { __typename?: 'AvailabilityResponse', available: boolean, message?: string | null, reason?: string | null, reservationId?: string | null } };

export type CreateWorkspaceMutationVariables = Exact<{
  slug: Scalars['String']['input'];
  name: Scalars['String']['input'];
}>;


export type CreateWorkspaceMutation = { __typename?: 'Mutation', createWorkspace: { __typename?: 'Workspace', id: string, slug: string, name: string } };

export type CheckSlugAvailabilityMutationVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type CheckSlugAvailabilityMutation = { __typename?: 'Mutation', checkSlugAvailability: { __typename?: 'AvailabilityResponse', available: boolean, message?: string | null } };

export type InviteToWorkspaceMutationVariables = Exact<{
  input: InviteToWorkspaceInput;
}>;


export type InviteToWorkspaceMutation = { __typename?: 'Mutation', inviteToWorkspace: { __typename?: 'InviteResponse', success: boolean, message: string, invitedCount: number } };

export type AcceptWorkspaceInviteMutationVariables = Exact<{
  input: AcceptInviteInput;
}>;


export type AcceptWorkspaceInviteMutation = { __typename?: 'Mutation', acceptWorkspaceInvite: { __typename?: 'JoinResponse', success: boolean, message: string, workspaceSlug: string } };

export type GetWorkspaceInviteInfoQueryVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type GetWorkspaceInviteInfoQuery = { __typename?: 'Query', getWorkspaceInviteInfo: { __typename?: 'WorkspaceInviteInfo', workspaceName: string, workspaceLogoUrl?: string | null, inviterName?: string | null } };

export type SyncUserMutationVariables = Exact<{
  clerkId: Scalars['String']['input'];
  email: Scalars['String']['input'];
  fullName?: InputMaybe<Scalars['String']['input']>;
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
}>;


export type SyncUserMutation = { __typename?: 'Mutation', syncUser: { __typename?: 'User', id: string } };

export type CreateOnboardingWorkspaceMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateOnboardingWorkspaceMutation = { __typename?: 'Mutation', createOnboardingWorkspace: { __typename?: 'Workspace', id: string, slug: string } };

export type OnboardingStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type OnboardingStatusQuery = { __typename?: 'Query', onboardingStatus: { __typename?: 'OnboardingStatus', hasUser: boolean, hasWorkspace: boolean, hasProject: boolean, workspaceSlug?: string | null } };

export type GetWorkspaceMembersQueryVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
}>;


export type GetWorkspaceMembersQuery = { __typename?: 'Query', workspaceMembers: Array<{ __typename?: 'WorkspaceMember', id: string, role: string, joinedAt: string, user: { __typename?: 'User', id: string, fullName?: string | null, email: string, avatarUrl?: string | null } }> };

export type UpdateWorkspaceMemberRoleMutationVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
  memberId: Scalars['ID']['input'];
  role: Scalars['String']['input'];
}>;


export type UpdateWorkspaceMemberRoleMutation = { __typename?: 'Mutation', updateWorkspaceMemberRole: { __typename?: 'WorkspaceMember', id: string, role: string } };

export type RemoveWorkspaceMemberMutationVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
  memberId: Scalars['ID']['input'];
}>;


export type RemoveWorkspaceMemberMutation = { __typename?: 'Mutation', removeWorkspaceMember: { __typename?: 'InviteResponse', success: boolean, message: string } };

export const MessageRecoveryFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageRecoveryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChatMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"streamId"}},{"kind":"Field","name":{"kind":"Name","value":"sequence"}},{"kind":"Field","name":{"kind":"Name","value":"conversationId"}},{"kind":"Field","name":{"kind":"Name","value":"authorUserId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<MessageRecoveryFieldsFragment, unknown>;
export const ConversationFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConversationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"description"},"name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentMessageId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"unreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]} as unknown as DocumentNode<ConversationFieldsFragment, unknown>;
export const ConversationMemberFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConversationMemberFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConversationMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isMuted"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<ConversationMemberFieldsFragment, unknown>;
export const ProjectFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}}]}}]}}]} as unknown as DocumentNode<ProjectFieldsFragment, unknown>;
export const SessionUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]} as unknown as DocumentNode<SessionUserFragment, unknown>;
export const UserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]} as unknown as DocumentNode<UserFragmentFragment, unknown>;
export const WorkspaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WorkspaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Workspace"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}}]} as unknown as DocumentNode<WorkspaceFragmentFragment, unknown>;
export const GetMissingMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMissingMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"afterSequence"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messagesDelta"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"afterSequence"},"value":{"kind":"Variable","name":{"kind":"Name","value":"afterSequence"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageRecoveryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"lastSequence"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageRecoveryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChatMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"streamId"}},{"kind":"Field","name":{"kind":"Name","value":"sequence"}},{"kind":"Field","name":{"kind":"Name","value":"conversationId"}},{"kind":"Field","name":{"kind":"Name","value":"authorUserId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetMissingMessagesQuery, GetMissingMessagesQueryVariables>;
export const GetHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"beforeSequence"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"history"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"beforeSequence"},"value":{"kind":"Variable","name":{"kind":"Name","value":"beforeSequence"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageRecoveryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"minSequence"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageRecoveryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChatMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"streamId"}},{"kind":"Field","name":{"kind":"Name","value":"sequence"}},{"kind":"Field","name":{"kind":"Name","value":"conversationId"}},{"kind":"Field","name":{"kind":"Name","value":"authorUserId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetHistoryQuery, GetHistoryQueryVariables>;
export const GetUserConversationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserConversations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ConversationType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeArchived"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserConversations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeArchived"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeArchived"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConversationFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConversationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"description"},"name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentMessageId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"unreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]} as unknown as DocumentNode<GetUserConversationsQuery, GetUserConversationsQueryVariables>;
export const GetConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConversationFields"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConversationMemberFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConversationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"description"},"name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentMessageId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"unreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConversationMemberFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConversationMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isMuted"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<GetConversationQuery, GetConversationQueryVariables>;
export const GetUsersByIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersByIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersByIds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<GetUsersByIdsQuery, GetUsersByIdsQueryVariables>;
export const GetProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}}]}}]}}]} as unknown as DocumentNode<GetProjectQuery, GetProjectQueryVariables>;
export const MyProjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyProjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myProjects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}}]}}]}}]} as unknown as DocumentNode<MyProjectsQuery, MyProjectsQueryVariables>;
export const GetProjectBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}}]}}]}}]} as unknown as DocumentNode<GetProjectBySlugQuery, GetProjectBySlugQueryVariables>;
export const SessionSyncUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SessionSyncUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clerkId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"clerkId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clerkId"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"fullName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}}},{"kind":"Argument","name":{"kind":"Name","value":"avatarUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<SessionSyncUserMutation, SessionSyncUserMutationVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SessionUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SessionUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetMyWorkspacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyWorkspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myWorkspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WorkspaceFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WorkspaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Workspace"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}}]} as unknown as DocumentNode<GetMyWorkspacesQuery, GetMyWorkspacesQueryVariables>;
export const GetWorkspaceBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkspaceBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WorkspaceFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WorkspaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Workspace"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}}]} as unknown as DocumentNode<GetWorkspaceBySlugQuery, GetWorkspaceBySlugQueryVariables>;
export const ArchiveChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ArchiveChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ArchiveChannelMutation, ArchiveChannelMutationVariables>;
export const CheckChannelAvailabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckChannelAvailability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CheckChannelAvailabilityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkChannelAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"reservationId"}}]}}]}}]} as unknown as DocumentNode<CheckChannelAvailabilityMutation, CheckChannelAvailabilityMutationVariables>;
export const CreateChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}}]}}]} as unknown as DocumentNode<CreateChannelMutation, CreateChannelMutationVariables>;
export const DeleteChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"channelId"}}]}}]}}]} as unknown as DocumentNode<DeleteChannelMutation, DeleteChannelMutationVariables>;
export const RenameChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenameChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RenameChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<RenameChannelMutation, RenameChannelMutationVariables>;
export const UnarchiveChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnarchiveChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unarchiveChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"channelId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UnarchiveChannelMutation, UnarchiveChannelMutationVariables>;
export const CreateProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProjectInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}}]}}]}}]} as unknown as DocumentNode<CreateProjectMutation, CreateProjectMutationVariables>;
export const CheckSlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckSlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkProjectSlugAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"reservationId"}}]}}]}}]} as unknown as DocumentNode<CheckSlugMutation, CheckSlugMutationVariables>;
export const CreateWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorkspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;
export const CheckSlugAvailabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckSlugAvailability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkSlugAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CheckSlugAvailabilityMutation, CheckSlugAvailabilityMutationVariables>;
export const InviteToWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InviteToWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteToWorkspaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inviteToWorkspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invitedCount"}}]}}]}}]} as unknown as DocumentNode<InviteToWorkspaceMutation, InviteToWorkspaceMutationVariables>;
export const AcceptWorkspaceInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptWorkspaceInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AcceptInviteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptWorkspaceInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceSlug"}}]}}]}}]} as unknown as DocumentNode<AcceptWorkspaceInviteMutation, AcceptWorkspaceInviteMutationVariables>;
export const GetWorkspaceInviteInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkspaceInviteInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWorkspaceInviteInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceName"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceLogoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"inviterName"}}]}}]}}]} as unknown as DocumentNode<GetWorkspaceInviteInfoQuery, GetWorkspaceInviteInfoQueryVariables>;
export const SyncUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clerkId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"clerkId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clerkId"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"fullName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}}},{"kind":"Argument","name":{"kind":"Name","value":"avatarUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SyncUserMutation, SyncUserMutationVariables>;
export const CreateOnboardingWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOnboardingWorkspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOnboardingWorkspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<CreateOnboardingWorkspaceMutation, CreateOnboardingWorkspaceMutationVariables>;
export const OnboardingStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OnboardingStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onboardingStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasUser"}},{"kind":"Field","name":{"kind":"Name","value":"hasWorkspace"}},{"kind":"Field","name":{"kind":"Name","value":"hasProject"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceSlug"}}]}}]}}]} as unknown as DocumentNode<OnboardingStatusQuery, OnboardingStatusQueryVariables>;
export const GetWorkspaceMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkspaceMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetWorkspaceMembersQuery, GetWorkspaceMembersQueryVariables>;
export const UpdateWorkspaceMemberRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWorkspaceMemberRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWorkspaceMemberRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<UpdateWorkspaceMemberRoleMutation, UpdateWorkspaceMemberRoleMutationVariables>;
export const RemoveWorkspaceMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveWorkspaceMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeWorkspaceMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<RemoveWorkspaceMemberMutation, RemoveWorkspaceMemberMutationVariables>;