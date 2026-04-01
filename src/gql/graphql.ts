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

export type ActiveCollaborator = {
  __typename?: 'ActiveCollaborator';
  connectionId: Scalars['ID']['output'];
  cursorPosition?: Maybe<CursorPosition>;
  joinedAt: Scalars['DateTime']['output'];
  lastSeenAt: Scalars['DateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type ActiveFeatureFlag = {
  __typename?: 'ActiveFeatureFlag';
  enabled: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
};

export type ActiveUserContext = {
  __typename?: 'ActiveUserContext';
  featureFlags: Array<ActiveFeatureFlag>;
  grantedPermissions: Array<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['ID']['output']>;
  projectRole?: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
  workspaceId: Scalars['ID']['output'];
  workspaceRole?: Maybe<Scalars['String']['output']>;
};

export type AddBoardCollaboratorsResult = {
  __typename?: 'AddBoardCollaboratorsResult';
  addedCount: Scalars['Int']['output'];
  skippedCount: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
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

export type AddPageCollaboratorsInput = {
  collaborators: Array<PageCollaboratorInput>;
  pageId: Scalars['ID']['input'];
};

export type AddPageCollaboratorsResult = {
  __typename?: 'AddPageCollaboratorsResult';
  addedCollaborators: Array<PageCollaborator>;
};

export type ArchiveChannelInput = {
  channelId: Scalars['ID']['input'];
};

export type ArchivePageInput = {
  pageId: Scalars['ID']['input'];
};

export type ArchivePageResult = {
  __typename?: 'ArchivePageResult';
  page: Page;
};

export type AvailabilityResponse = {
  __typename?: 'AvailabilityResponse';
  available: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  reservationId?: Maybe<Scalars['String']['output']>;
};

export type BoardCollaborator = {
  __typename?: 'BoardCollaborator';
  joinedAt: Scalars['DateTime']['output'];
  user: UserBasic;
  userId: Scalars['ID']['output'];
};

export type BoardConnection = {
  __typename?: 'BoardConnection';
  boards: Array<Whiteboard>;
  nextCursor?: Maybe<Scalars['ID']['output']>;
};

export type BoardPayload = {
  __typename?: 'BoardPayload';
  /** Collaborators that were successfully added (may be fewer than requested if some failed validation) */
  addedCollaborators: Array<BoardCollaborator>;
  board: Whiteboard;
};

export type BoardSnapshot = {
  __typename?: 'BoardSnapshot';
  boardId: Scalars['ID']['output'];
  lastStreamId?: Maybe<Scalars['String']['output']>;
  snapshot: Scalars['String']['output'];
  snapshotTimestamp?: Maybe<Scalars['DateTime']['output']>;
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

export type ConfirmIssueDescriptionUploadInput = {
  descriptionFileId: Scalars['ID']['input'];
};

export type ConfirmIssueDescriptionUploadResult = {
  __typename?: 'ConfirmIssueDescriptionUploadResult';
  issue: Issue;
};

export type ConfirmUploadResult = {
  __typename?: 'ConfirmUploadResult';
  file: VaultFile;
};

export type ConfirmVaultUploadInput = {
  fileId: Scalars['ID']['input'];
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

export type CreateBoardInput = {
  /** Optional: Add workspace members as collaborators during board creation */
  collaboratorIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
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

export type CreateFolderResult = {
  __typename?: 'CreateFolderResult';
  folder: VaultFolder;
};

export type CreateGroupInput = {
  memberUserIds: Array<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};

export type CreateIssueInput = {
  assigneeId?: InputMaybe<Scalars['ID']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  labelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  priority?: InputMaybe<IssuePriority>;
  projectId: Scalars['ID']['input'];
  statusId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type CreateIssueLabelInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  projectId: Scalars['ID']['input'];
};

export type CreateIssueLabelResult = {
  __typename?: 'CreateIssueLabelResult';
  label: IssueLabel;
};

export type CreateIssueResult = {
  __typename?: 'CreateIssueResult';
  issue: Issue;
};

export type CreateIssueStatusInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  projectId: Scalars['ID']['input'];
};

export type CreateIssueStatusResult = {
  __typename?: 'CreateIssueStatusResult';
  status: IssueStatus;
};

export type CreatePageInput = {
  collaboratorIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  coverUrl?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  /** null = root-level page */
  parentId?: InputMaybe<Scalars['ID']['input']>;
  /** Fractional index position for sibling ordering */
  position: Scalars['Float']['input'];
  projectId: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  workspaceId: Scalars['ID']['input'];
};

export type CreatePageResult = {
  __typename?: 'CreatePageResult';
  page: Page;
};

export type CreateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProjectRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  rank: Scalars['Int']['input'];
};

export type CreateThreadInput = {
  conversationId: Scalars['ID']['input'];
  messageId: Scalars['ID']['input'];
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};

export type CreateVaultFolderInput = {
  name: Scalars['String']['input'];
  /** null = create at root level (Home) */
  parentFolderId?: InputMaybe<Scalars['ID']['input']>;
  projectId: Scalars['ID']['input'];
};

export type CreateWorkspaceRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  rank: Scalars['Int']['input'];
};

export type CursorPosition = {
  __typename?: 'CursorPosition';
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type DeleteBoardResult = {
  __typename?: 'DeleteBoardResult';
  boardId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
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

export type DeleteIssueInput = {
  issueId: Scalars['ID']['input'];
};

export type DeleteIssueLabelInput = {
  labelId: Scalars['ID']['input'];
};

export type DeleteIssueStatusInput = {
  statusId: Scalars['ID']['input'];
};

export type DeletePageInput = {
  pageId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};

export type DeletePageResult = {
  __typename?: 'DeletePageResult';
  pageId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
};

/** Generic success/id response for delete operations */
export type DeleteResult = {
  __typename?: 'DeleteResult';
  id: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
};

export type DeleteThreadResult = {
  __typename?: 'DeleteThreadResult';
  success: Scalars['Boolean']['output'];
  threadId: Scalars['ID']['output'];
};

export type DeleteVaultFileInput = {
  fileId: Scalars['ID']['input'];
};

export type DeleteVaultFolderInput = {
  cascade?: InputMaybe<Scalars['Boolean']['input']>;
  folderId: Scalars['ID']['input'];
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

export type DmUserProfile = {
  __typename?: 'DmUserProfile';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type FeatureFlagRecord = {
  __typename?: 'FeatureFlagRecord';
  defaultEnabled: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  overrides: Array<FlagOverrideRecord>;
};

export enum FlagContextType {
  Global = 'GLOBAL',
  Project = 'PROJECT',
  User = 'USER',
  Workspace = 'WORKSPACE'
}

export type FlagOverrideRecord = {
  __typename?: 'FlagOverrideRecord';
  contextId?: Maybe<Scalars['ID']['output']>;
  contextType: FlagContextType;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
};

/** Returned by getPageSnapshot — everything the client needs to initialise the Y.Doc */
export type GetPageSnapshotResult = {
  __typename?: 'GetPageSnapshotResult';
  /** Last Redis Stream entry ID processed into this snapshot — used for gap-fill on subscribe */
  lastStreamId: Scalars['String']['output'];
  pageId: Scalars['ID']['output'];
  /** base64-encoded Y.encodeStateAsUpdate() — apply on client with Y.applyUpdate() */
  snapshot: Scalars['String']['output'];
  /** Unix timestamp (ms) of when this snapshot was compiled */
  snapshotTimestamp: Scalars['Float']['output'];
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
  roleId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};

export type Issue = {
  __typename?: 'Issue';
  assignee?: Maybe<IssueUser>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: IssueUser;
  descriptionS3Key?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  labels: Array<IssueLabel>;
  number: Scalars['Int']['output'];
  position: Scalars['Float']['output'];
  priority: IssuePriority;
  projectId: Scalars['ID']['output'];
  status: IssueStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  workspaceId: Scalars['ID']['output'];
};

export type IssueDescriptionUrl = {
  __typename?: 'IssueDescriptionUrl';
  expiresAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
};

export type IssueLabel = {
  __typename?: 'IssueLabel';
  color: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  projectId: Scalars['ID']['output'];
};

export enum IssuePriority {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
  NoPriority = 'NO_PRIORITY',
  Urgent = 'URGENT'
}

export type IssueStatus = {
  __typename?: 'IssueStatus';
  color: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isSystem: Scalars['Boolean']['output'];
  issueCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  position: Scalars['Float']['output'];
  projectId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type IssueStatusCount = {
  __typename?: 'IssueStatusCount';
  color: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  issueCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  statusId: Scalars['ID']['output'];
};

export type IssueUser = {
  __typename?: 'IssueUser';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
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

export type LockPageInput = {
  pageId: Scalars['ID']['input'];
};

export type LockPageResult = {
  __typename?: 'LockPageResult';
  page: Page;
};

export type MarkFilesUnreferencedInput = {
  /** The entity (page or issue) whose save triggered this mark. */
  entityId: Scalars['ID']['input'];
  /** The entity type — PAGE or TASK. */
  entityType: VaultFileSource;
  /** File IDs that are no longer present in the saved document content. */
  fileIds: Array<Scalars['ID']['input']>;
};

export type MarkFilesUnreferencedResult = {
  __typename?: 'MarkFilesUnreferencedResult';
  /** Number of files successfully marked unreferenced. */
  markedCount: Scalars['Int']['output'];
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

export type MoveFileResult = {
  __typename?: 'MoveFileResult';
  file: VaultFile;
};

export type MoveFolderResult = {
  __typename?: 'MoveFolderResult';
  folder: VaultFolder;
};

export type MoveIssueStatusInput = {
  issueId: Scalars['ID']['input'];
  newPosition?: InputMaybe<Scalars['Float']['input']>;
  statusId: Scalars['ID']['input'];
};

export type MoveIssueStatusResult = {
  __typename?: 'MoveIssueStatusResult';
  issue: Issue;
};

export type MoveVaultFileInput = {
  fileId: Scalars['ID']['input'];
  /** null = move to root (Home) */
  targetFolderId?: InputMaybe<Scalars['ID']['input']>;
};

export type MoveVaultFolderInput = {
  folderId: Scalars['ID']['input'];
  /** null = move to root (Home) */
  targetParentFolderId?: InputMaybe<Scalars['ID']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _health?: Maybe<Scalars['String']['output']>;
  acceptWorkspaceInvite: JoinResponse;
  addBoardCollaborators: AddBoardCollaboratorsResult;
  addChannelMembers: AddChannelMembersResult;
  addGroupMembers: AddGroupMembersResult;
  /** Upsert-semantics: can be used for both inviting and changing roles. */
  addPageCollaborators: AddPageCollaboratorsResult;
  addProjectMember: ProjectMember;
  archiveBoard: Whiteboard;
  archiveChannel: Conversation;
  /** Archives a page and all its descendants. */
  archivePage: ArchivePageResult;
  archiveProject: Project;
  assignRolePermission: RolePermission;
  cancelWorkspaceInvite: Scalars['Boolean']['output'];
  checkChannelAvailability: ChannelAvailabilityResponse;
  checkProjectSlugAvailability: AvailabilityResponse;
  checkSlugAvailability: AvailabilityResponse;
  closeThread: CloseThreadResult;
  /** Step 2 of 2: verifies S3 upload and activates the description. */
  confirmIssueDescriptionUpload: ConfirmIssueDescriptionUploadResult;
  /**
   * Step 2 of 2 for uploading a file to Vault.
   * Verifies the S3 object (size + MIME), sets the file to ACTIVE, and updates storage usage.
   */
  confirmVaultUpload: ConfirmUploadResult;
  createBoard: BoardPayload;
  createChannel: Conversation;
  createDm: Conversation;
  createGroup: Conversation;
  createIssue: CreateIssueResult;
  createIssueLabel: CreateIssueLabelResult;
  createIssueStatus: CreateIssueStatusResult;
  createOnboardingWorkspace: Workspace;
  /**
   * Creates a new page in a project. Initialises Y.Doc and uploads initial snapshot to S3.
   * The calling user is automatically added as an EDITOR collaborator.
   */
  createPage: CreatePageResult;
  createProject: Project;
  createProjectRole: ProjectRole;
  createThread: Conversation;
  createVaultFolder: CreateFolderResult;
  createWorkspace: Workspace;
  createWorkspaceRole: WorkspaceRole;
  deleteAccount: Scalars['Boolean']['output'];
  deleteBoard: DeleteBoardResult;
  deleteChannel: DeleteChannelResult;
  deleteDm: DeleteDmResult;
  deleteGroup: DeleteGroupResult;
  deleteIssue: DeleteResult;
  deleteIssueLabel: DeleteResult;
  deleteIssueStatus: DeleteResult;
  /**
   * Soft-deletes a page. Fails with 409 if the page has active subscribers.
   * Does not cascade to child pages — handle descendants explicitly first.
   */
  deletePage: DeletePageResult;
  deleteProject: Scalars['Boolean']['output'];
  deleteProjectRole: Scalars['Boolean']['output'];
  deleteThread: DeleteThreadResult;
  /** Soft-deletes a vault file and releases its storage quota. */
  deleteVaultFile: DeleteResult;
  /**
   * Soft-deletes a folder.
   * cascade=false (default): returns error if folder is non-empty.
   * cascade=true: recursively soft-deletes all child folders and files.
   */
  deleteVaultFolder: DeleteResult;
  deleteWorkspace: Scalars['Boolean']['output'];
  deleteWorkspaceRole: Scalars['Boolean']['output'];
  inviteToWorkspace: InviteResponse;
  leaveGroup: LeaveGroupResult;
  leaveProject: Scalars['Boolean']['output'];
  leaveWorkspace: Scalars['Boolean']['output'];
  lockBoard: Whiteboard;
  /**
   * Acquires an exclusive editor lock on the page.
   * Returns 423 if another user currently holds the lock.
   * Lock auto-releases after 1 hour (safety net for crashed clients).
   */
  lockPage: LockPageResult;
  /** Mark all notifications as read. */
  markAllNotificationsRead: Scalars['Boolean']['output'];
  /**
   * Called by the editor on save when one or more vault://fileId references
   * have been removed from the document content since the last save.
   *
   * Does NOT delete files immediately — sets unrefAt for the cleanup job to
   * process after a grace period (default 30 min), preserving in-session undo.
   */
  markFilesUnreferenced: MarkFilesUnreferencedResult;
  /** Mark specific notifications as read. */
  markNotificationRead: Scalars['Boolean']['output'];
  moveIssueStatus: MoveIssueStatusResult;
  moveVaultFile: MoveFileResult;
  moveVaultFolder: MoveFolderResult;
  muteConversation: MuteConversationResult;
  pinVaultFolder: PinFolderResult;
  /**
   * Register a file upload initiated outside the standard Vault UI flow.
   * Used by Chat (attachments), Pages/Issues (BlockNote uploadFile adapter),
   * and Whiteboard (Excalidraw onAddFile).
   *
   * Enforces storage quota before issuing the presigned URL.
   * Creates a PENDING VaultFile row. The caller must:
   *   1. PUT bytes to presignedUrl
   *   2. Call confirmVaultUpload(fileId) to activate
   */
  registerExternalFile: RegisterExternalFileResult;
  removeBoardCollaborator: RemoveBoardCollaboratorResult;
  removeChannelMember: RemoveChannelMemberResult;
  removeGroupMember: RemoveGroupMemberResult;
  /** Cannot remove the page creator. */
  removePageCollaborator: RemovePageCollaboratorResult;
  removeProjectMember: Scalars['Boolean']['output'];
  removeRolePermission: Scalars['Boolean']['output'];
  removeWorkspaceMember: InviteResponse;
  renameBoard: Whiteboard;
  renameChannel: Conversation;
  renameGroup: RenameGroupResult;
  renamePage: RenamePageResult;
  /** Renames a file. S3 key is unchanged — only the display name is updated. */
  renameVaultFile: RenameFileResult;
  renameVaultFolder: RenameFolderResult;
  reopenThread: ReopenThreadResult;
  reorderIssue: ReorderIssueResult;
  reorderIssueStatus: ReorderIssueStatusResult;
  /**
   * Moves a page to a new position (and optionally a new parent).
   * Validate no circular nesting before calling (circular guard runs server-side too).
   */
  reorderPage: ReorderPageResult;
  /** Step 1 of 2: reserves an S3 slot and returns a presigned PUT URL. */
  requestIssueDescriptionUpload: RequestIssueDescriptionUploadResult;
  /**
   * Step 1 of 2 for uploading a file to Vault.
   * Checks quota, creates a PENDING VaultFile row, returns a presigned PUT URL.
   * The client must PUT the file directly to S3 using this URL, then call confirmVaultUpload.
   */
  requestVaultUpload: RequestUploadResult;
  resendWorkspaceInvite: Scalars['Boolean']['output'];
  subscribeThread: SubscribeThreadResult;
  syncUser: User;
  toggleFeatureFlag: ToggleFlagResult;
  toggleProjectPlugin: Scalars['Boolean']['output'];
  transferWorkspaceOwnership: WorkspaceMember;
  unarchiveBoard: Whiteboard;
  unarchiveChannel: UnarchiveChannelResult;
  /**
   * Unarchives a page. Fails if the parent is still archived.
   * Child pages are NOT automatically unarchived — handle each explicitly.
   */
  unarchivePage: UnarchivePageResult;
  unarchiveProject: Project;
  unlockBoard: Whiteboard;
  /** Lock owner or workspace ADMIN can unlock. */
  unlockPage: UnlockPageResult;
  unpinVaultFolder: DeleteResult;
  unsubscribeThread: UnsubscribeThreadResult;
  updateBoardDescription: Whiteboard;
  updateChannelDescription: UpdateChannelDescriptionResult;
  updateChannelVisibility: UpdateChannelVisibilityResult;
  updateIssue: UpdateIssueResult;
  updateIssueLabel: UpdateIssueLabelResult;
  updateIssueStatus: UpdateIssueStatusResult;
  updateProfile: User;
  updateProject: Project;
  updateProjectMemberRole: ProjectMember;
  updateProjectRole: ProjectRole;
  updateWorkspace: Workspace;
  updateWorkspaceMemberRole: WorkspaceMember;
  updateWorkspaceRole: WorkspaceRole;
};


export type MutationAcceptWorkspaceInviteArgs = {
  input: AcceptInviteInput;
};


export type MutationAddBoardCollaboratorsArgs = {
  boardId: Scalars['ID']['input'];
  userIds: Array<Scalars['ID']['input']>;
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


export type MutationAddPageCollaboratorsArgs = {
  input: AddPageCollaboratorsInput;
};


export type MutationAddProjectMemberArgs = {
  projectId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationArchiveBoardArgs = {
  boardId: Scalars['ID']['input'];
};


export type MutationArchiveChannelArgs = {
  input: ArchiveChannelInput;
};


export type MutationArchivePageArgs = {
  input: ArchivePageInput;
};


export type MutationArchiveProjectArgs = {
  projectId: Scalars['ID']['input'];
};


export type MutationAssignRolePermissionArgs = {
  conditions?: InputMaybe<Scalars['String']['input']>;
  effect?: InputMaybe<Scalars['String']['input']>;
  permissionId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationCancelWorkspaceInviteArgs = {
  inviteId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
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


export type MutationConfirmIssueDescriptionUploadArgs = {
  input: ConfirmIssueDescriptionUploadInput;
};


export type MutationConfirmVaultUploadArgs = {
  input: ConfirmVaultUploadInput;
};


export type MutationCreateBoardArgs = {
  input: CreateBoardInput;
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


export type MutationCreateIssueArgs = {
  input: CreateIssueInput;
};


export type MutationCreateIssueLabelArgs = {
  input: CreateIssueLabelInput;
};


export type MutationCreateIssueStatusArgs = {
  input: CreateIssueStatusInput;
};


export type MutationCreatePageArgs = {
  input: CreatePageInput;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
  workspaceId: Scalars['ID']['input'];
};


export type MutationCreateProjectRoleArgs = {
  input: CreateProjectRoleInput;
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationCreateThreadArgs = {
  input: CreateThreadInput;
};


export type MutationCreateVaultFolderArgs = {
  input: CreateVaultFolderInput;
};


export type MutationCreateWorkspaceArgs = {
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};


export type MutationCreateWorkspaceRoleArgs = {
  input: CreateWorkspaceRoleInput;
  workspaceId: Scalars['ID']['input'];
};


export type MutationDeleteBoardArgs = {
  boardId: Scalars['ID']['input'];
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


export type MutationDeleteIssueArgs = {
  input: DeleteIssueInput;
};


export type MutationDeleteIssueLabelArgs = {
  input: DeleteIssueLabelInput;
};


export type MutationDeleteIssueStatusArgs = {
  input: DeleteIssueStatusInput;
};


export type MutationDeletePageArgs = {
  input: DeletePageInput;
};


export type MutationDeleteProjectArgs = {
  projectId: Scalars['ID']['input'];
};


export type MutationDeleteProjectRoleArgs = {
  projectId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationDeleteThreadArgs = {
  threadId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationDeleteVaultFileArgs = {
  input: DeleteVaultFileInput;
};


export type MutationDeleteVaultFolderArgs = {
  input: DeleteVaultFolderInput;
};


export type MutationDeleteWorkspaceArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type MutationDeleteWorkspaceRoleArgs = {
  roleId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationInviteToWorkspaceArgs = {
  input: InviteToWorkspaceInput;
};


export type MutationLeaveGroupArgs = {
  groupId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationLeaveProjectArgs = {
  projectId: Scalars['ID']['input'];
};


export type MutationLeaveWorkspaceArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type MutationLockBoardArgs = {
  boardId: Scalars['ID']['input'];
};


export type MutationLockPageArgs = {
  input: LockPageInput;
};


export type MutationMarkFilesUnreferencedArgs = {
  input: MarkFilesUnreferencedInput;
};


export type MutationMarkNotificationReadArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationMoveIssueStatusArgs = {
  input: MoveIssueStatusInput;
};


export type MutationMoveVaultFileArgs = {
  input: MoveVaultFileInput;
};


export type MutationMoveVaultFolderArgs = {
  input: MoveVaultFolderInput;
};


export type MutationMuteConversationArgs = {
  conversationId: Scalars['ID']['input'];
  isMuted: Scalars['Boolean']['input'];
};


export type MutationPinVaultFolderArgs = {
  input: PinVaultFolderInput;
};


export type MutationRegisterExternalFileArgs = {
  input: RegisterExternalFileInput;
};


export type MutationRemoveBoardCollaboratorArgs = {
  boardId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
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


export type MutationRemovePageCollaboratorArgs = {
  input: RemovePageCollaboratorInput;
};


export type MutationRemoveProjectMemberArgs = {
  projectId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationRemoveRolePermissionArgs = {
  permissionId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationRemoveWorkspaceMemberArgs = {
  memberId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationRenameBoardArgs = {
  boardId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};


export type MutationRenameChannelArgs = {
  input: RenameChannelInput;
};


export type MutationRenameGroupArgs = {
  groupId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationRenamePageArgs = {
  input: RenamePageInput;
};


export type MutationRenameVaultFileArgs = {
  input: RenameVaultFileInput;
};


export type MutationRenameVaultFolderArgs = {
  input: RenameVaultFolderInput;
};


export type MutationReopenThreadArgs = {
  threadId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationReorderIssueArgs = {
  input: ReorderIssueInput;
};


export type MutationReorderIssueStatusArgs = {
  input: ReorderIssueStatusInput;
};


export type MutationReorderPageArgs = {
  input: ReorderPageInput;
};


export type MutationRequestIssueDescriptionUploadArgs = {
  input: RequestIssueDescriptionUploadInput;
};


export type MutationRequestVaultUploadArgs = {
  input: RequestVaultUploadInput;
};


export type MutationResendWorkspaceInviteArgs = {
  inviteId: Scalars['ID']['input'];
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


export type MutationToggleFeatureFlagArgs = {
  input: ToggleFeatureFlagInput;
};


export type MutationToggleProjectPluginArgs = {
  enable: Scalars['Boolean']['input'];
  projectId: Scalars['ID']['input'];
  type: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationTransferWorkspaceOwnershipArgs = {
  newOwnerId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationUnarchiveBoardArgs = {
  boardId: Scalars['ID']['input'];
};


export type MutationUnarchiveChannelArgs = {
  channelId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationUnarchivePageArgs = {
  input: UnarchivePageInput;
};


export type MutationUnarchiveProjectArgs = {
  projectId: Scalars['ID']['input'];
};


export type MutationUnlockBoardArgs = {
  boardId: Scalars['ID']['input'];
};


export type MutationUnlockPageArgs = {
  input: UnlockPageInput;
};


export type MutationUnpinVaultFolderArgs = {
  input: UnpinVaultFolderInput;
};


export type MutationUnsubscribeThreadArgs = {
  threadId: Scalars['ID']['input'];
};


export type MutationUpdateBoardDescriptionArgs = {
  boardId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
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


export type MutationUpdateIssueArgs = {
  input: UpdateIssueInput;
};


export type MutationUpdateIssueLabelArgs = {
  input: UpdateIssueLabelInput;
};


export type MutationUpdateIssueStatusArgs = {
  input: UpdateIssueStatusInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
  projectId: Scalars['ID']['input'];
};


export type MutationUpdateProjectMemberRoleArgs = {
  projectId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationUpdateProjectRoleArgs = {
  input: UpdateProjectRoleInput;
  projectId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationUpdateWorkspaceArgs = {
  input: UpdateWorkspaceInput;
  workspaceId: Scalars['ID']['input'];
};


export type MutationUpdateWorkspaceMemberRoleArgs = {
  memberId: Scalars['ID']['input'];
  role: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationUpdateWorkspaceRoleArgs = {
  input: UpdateWorkspaceRoleInput;
  roleId: Scalars['ID']['input'];
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

export type OverviewIssue = {
  __typename?: 'OverviewIssue';
  assigneeAvatar?: Maybe<Scalars['String']['output']>;
  assigneeId?: Maybe<Scalars['ID']['output']>;
  assigneeName?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  number: Scalars['Int']['output'];
  priority: Scalars['String']['output'];
  statusColor: Scalars['String']['output'];
  statusName: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type OverviewMember = {
  __typename?: 'OverviewMember';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  joinedAt: Scalars['String']['output'];
  name: Scalars['String']['output'];
  roleName?: Maybe<Scalars['String']['output']>;
  roleRank?: Maybe<Scalars['Int']['output']>;
  userId: Scalars['ID']['output'];
};

/**
 * A collaborative document page within a project.
 * The Y.Doc content is synced via WebSocket and accessed via getPageSnapshot.
 */
export type Page = {
  __typename?: 'Page';
  /** Populated only by getProjectPages — empty in all other contexts */
  children: Array<Page>;
  collaborators: Array<PageCollaborator>;
  coverUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['ID']['output'];
  creator: UserBasic;
  /** Emoji or absolute URL for the page icon */
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isArchived: Scalars['Boolean']['output'];
  isLocked: Scalars['Boolean']['output'];
  /** null = root-level page (no parent) */
  parentId?: Maybe<Scalars['ID']['output']>;
  /** Fractional index position for ordering within parent (e.g., 1.5 between 1.0 and 2.0) */
  position: Scalars['Float']['output'];
  projectId: Scalars['ID']['output'];
  /** S3 key for the latest compiled Yjs snapshot (disaster recovery reference) */
  s3Key?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  workspaceId: Scalars['ID']['output'];
};

export type PageCollaborator = {
  __typename?: 'PageCollaborator';
  joinedAt: Scalars['DateTime']['output'];
  role: PageRole;
  user: UserBasic;
  userId: Scalars['ID']['output'];
};

export type PageCollaboratorInput = {
  role: PageRole;
  userId: Scalars['ID']['input'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export enum PageRole {
  Commenter = 'COMMENTER',
  Editor = 'EDITOR',
  Viewer = 'VIEWER'
}

/**
 * Returned by getPageSnapshot.
 *
 * snapshot         — base64 Y.js diff. Client calls Y.applyUpdate(localDoc, decode(snapshot)).
 * lastStreamId     — client passes this to subscribe-page for gap-fill replay.
 * snapshotTimestamp — when the base snapshot was last compacted by the stream worker. Null for new pages.
 */
export type PageSnapshot = {
  __typename?: 'PageSnapshot';
  lastStreamId: Scalars['String']['output'];
  snapshot: Scalars['String']['output'];
  snapshotTimestamp?: Maybe<Scalars['DateTime']['output']>;
};

export type Permission = {
  __typename?: 'Permission';
  action: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  module: Scalars['String']['output'];
  resource: Scalars['String']['output'];
};

export type PinFolderResult = {
  __typename?: 'PinFolderResult';
  folder: VaultFolder;
};

export type PinVaultFolderInput = {
  folderId: Scalars['ID']['input'];
  projectId: Scalars['ID']['input'];
};

export enum PresenceStatus {
  Away = 'AWAY',
  Offline = 'OFFLINE',
  Online = 'ONLINE'
}

export type Project = {
  __typename?: 'Project';
  activePlugins: Array<Scalars['String']['output']>;
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

/**
 * A 1:1 DM conversation with the other participant's profile resolved.
 * The caller's own userId must be used to identify 'otherUser' on the client.
 */
export type ProjectDmItem = {
  __typename?: 'ProjectDmItem';
  id: Scalars['ID']['output'];
  otherUser: DmUserProfile;
  unreadCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProjectMember = {
  __typename?: 'ProjectMember';
  id: Scalars['ID']['output'];
  joinedAt: Scalars['String']['output'];
  role?: Maybe<Scalars['String']['output']>;
  user: User;
  userId: Scalars['ID']['output'];
};

export type ProjectOverview = {
  __typename?: 'ProjectOverview';
  completedIssues: Scalars['Int']['output'];
  issuesByStatus: Array<IssueStatusCount>;
  members: Array<OverviewMember>;
  openIssues: Scalars['Int']['output'];
  overdueIssues: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  recentIssues: Array<OverviewIssue>;
  totalIssues: Scalars['Int']['output'];
};

export type ProjectRole = {
  __typename?: 'ProjectRole';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isSystem: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  projectId?: Maybe<Scalars['ID']['output']>;
  rank: Scalars['Int']['output'];
  scopeType: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  workspaceId: Scalars['ID']['output'];
};

export type PublicUser = {
  __typename?: 'PublicUser';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  fullName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  activeCollaborators: Array<ActiveCollaborator>;
  activeContext: ActiveUserContext;
  allPermissions: Array<Permission>;
  boardCollaborators: Array<BoardCollaborator>;
  featureFlags: Array<FeatureFlagRecord>;
  /** Live presence from Redis ZSET (not DB). Reflects current editing sessions. */
  getActivePageCollaborators: Array<PageCollaborator>;
  /**
   * Batch-fetch presigned GET URLs for a list of fileIds.
   * Returns one result entry per fileId in the same order as the input.
   * Failed or deleted files return a non-null entry with status != ACTIVE.
   *
   * Max 50 fileIds per call.
   */
  getBatchDownloadUrls: Array<VaultBatchDownloadResult>;
  getBoard?: Maybe<Whiteboard>;
  getBoardSnapshot: BoardSnapshot;
  getChannelMembers: Array<ChatMemberRecord>;
  getConversation: Conversation;
  getDmByUsers?: Maybe<DmConversation>;
  /** Returns full detail for a single issue. Used when opening the issue modal. */
  getIssue: Issue;
  /**
   * Returns a short-lived presigned GET URL for reading an issue description from S3.
   * TTL: 5 minutes. Always request fresh — never cache.
   */
  getIssueDescriptionUrl: IssueDescriptionUrl;
  /** Returns all labels defined in a project. */
  getIssueLabels: Array<IssueLabel>;
  /** Returns all Kanban columns for a project, ordered by position. */
  getIssueStatuses: Array<IssueStatus>;
  getLastReadMessage?: Maybe<Scalars['ID']['output']>;
  getMessageById?: Maybe<ChatMessage>;
  getMessagesAfterCursor: Array<ChatMessage>;
  getMissingMessages: Array<ChatMessage>;
  /** Fetch page metadata. Use getPageSnapshot for Y.Doc content. */
  getPage: Page;
  /** DB collaborator list (authoritative). For real-time presence, use getActivePageCollaborators. */
  getPageCollaborators: Array<PageCollaborator>;
  /**
   * Returns the authoritative Y.Doc snapshot diff + a stream cursor for gap-fill.
   *
   * First open (no offline state):
   *   getPageSnapshot(pageId: "cuid")
   *
   * Reconnect with offline edits:
   *   getPageSnapshot(pageId: "cuid", clientSnapshot: "<base64 Y.encodeStateAsUpdate>")
   *
   * Client workflow:
   *   1. Call this query → receive { snapshot, lastStreamId }
   *   2. Apply snapshot: Y.applyUpdate(localDoc, base64Decode(snapshot))
   *   3. Open WS: page:subscribe-page { pageId, lastStreamId }  ← gap-fill
   */
  getPageSnapshot: PageSnapshot;
  getProjectDms: Array<ProjectDmItem>;
  /**
   * Returns all issues for a project, sorted by priority (URGENT first)
   * then by position within each column.
   * Optional filters: assigneeId, labelIds, priority.
   */
  getProjectIssues: Array<Issue>;
  /** Returns the full nested page tree for a project (non-archived, non-deleted). */
  getProjectPages: Array<Page>;
  getReadReceipts: ReadReceiptsResponse;
  getThreadMessages: Array<ChatMessage>;
  getUnreadCounts: UnreadCountsResponse;
  getUserConversations: ConversationConnection;
  getUsersByIds: Array<UserBasic>;
  /**
   * Returns the ancestor folder chain for a given folder, ordered root → current.
   * The last element is the folder itself, the first is the top-level ancestor.
   * Returns [] when the folder has no parent (it is already at root level).
   * Used exclusively by the vault breadcrumb (server fallback path for direct URL visits).
   */
  getVaultAncestors: Array<VaultFolder>;
  /**
   * Returns the immediate children (subfolders + files) of a folder.
   * parentFolderId = null → Home view (root-level items with no parent).
   */
  getVaultChildren: VaultChildrenResult;
  /**
   * Returns a short-lived presigned GET URL for downloading or previewing a vault file.
   * URL is valid for 5 minutes. Never cache — always request fresh.
   */
  getVaultDownloadUrl: VaultDownloadUrl;
  /**
   * Returns full metadata for a single vault folder or file.
   * Used for the detail/info side panel. Not used for listing.
   */
  getVaultNode: VaultNode;
  /**
   * Returns sidebar data: user-pinned folders + system folders (From Chat, From Pages, etc.).
   * Fetched once on Vault mount. Never re-called during folder navigation.
   */
  getVaultSidebar: VaultSidebar;
  /**
   * Returns current storage usage for the project and its workspace.
   * Poll every 60 seconds + invalidate after uploads/deletions.
   */
  getVaultUsage: VaultUsage;
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
  projectMembers: Array<ProjectMember>;
  projectOverview: ProjectOverview;
  projectRoles: Array<ProjectRole>;
  reactionUsers: ReactionUsersConnection;
  rolePermissions: Array<RolePermission>;
  /** Get count of unread notifications. */
  unreadNotificationCount: Scalars['Int']['output'];
  user?: Maybe<PublicUser>;
  userBoards: BoardConnection;
  workspaceBoards: BoardConnection;
  workspaceById?: Maybe<Workspace>;
  workspaceBySlug: Workspace;
  workspaceInvites: Array<WorkspaceInvite>;
  workspaceMembers: Array<WorkspaceMember>;
  workspaceOverview: WorkspaceOverview;
  workspaceRoles: Array<WorkspaceRole>;
  workspaceUser?: Maybe<WorkspaceMember>;
};


export type QueryActiveCollaboratorsArgs = {
  boardId: Scalars['ID']['input'];
};


export type QueryActiveContextArgs = {
  projectId?: InputMaybe<Scalars['ID']['input']>;
  workspaceId: Scalars['ID']['input'];
};


export type QueryAllPermissionsArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type QueryBoardCollaboratorsArgs = {
  boardId: Scalars['ID']['input'];
};


export type QueryGetActivePageCollaboratorsArgs = {
  pageId: Scalars['ID']['input'];
};


export type QueryGetBatchDownloadUrlsArgs = {
  fileIds: Array<Scalars['ID']['input']>;
};


export type QueryGetBoardArgs = {
  boardId: Scalars['ID']['input'];
};


export type QueryGetBoardSnapshotArgs = {
  boardId: Scalars['ID']['input'];
  clientSnapshot?: InputMaybe<Scalars['String']['input']>;
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


export type QueryGetIssueArgs = {
  issueId: Scalars['ID']['input'];
};


export type QueryGetIssueDescriptionUrlArgs = {
  issueId: Scalars['ID']['input'];
};


export type QueryGetIssueLabelsArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryGetIssueStatusesArgs = {
  projectId: Scalars['ID']['input'];
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


export type QueryGetPageArgs = {
  pageId: Scalars['ID']['input'];
};


export type QueryGetPageCollaboratorsArgs = {
  pageId: Scalars['ID']['input'];
};


export type QueryGetPageSnapshotArgs = {
  pageId: Scalars['ID']['input'];
};


export type QueryGetProjectDmsArgs = {
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type QueryGetProjectIssuesArgs = {
  assigneeId?: InputMaybe<Scalars['ID']['input']>;
  labelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  priority?: InputMaybe<IssuePriority>;
  projectId: Scalars['ID']['input'];
};


export type QueryGetProjectPagesArgs = {
  projectId: Scalars['ID']['input'];
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


export type QueryGetVaultAncestorsArgs = {
  folderId: Scalars['ID']['input'];
};


export type QueryGetVaultChildrenArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  parentFolderId?: InputMaybe<Scalars['ID']['input']>;
  projectId: Scalars['ID']['input'];
  sortBy?: InputMaybe<VaultSortField>;
  sortDir?: InputMaybe<SortDirection>;
};


export type QueryGetVaultDownloadUrlArgs = {
  fileId: Scalars['ID']['input'];
};


export type QueryGetVaultNodeArgs = {
  id: Scalars['ID']['input'];
  type: VaultNodeType;
};


export type QueryGetVaultSidebarArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryGetVaultUsageArgs = {
  projectId: Scalars['ID']['input'];
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


export type QueryProjectMembersArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryProjectOverviewArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryProjectRolesArgs = {
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type QueryReactionUsersArgs = {
  cursor?: InputMaybe<Scalars['Int']['input']>;
  emoji: Scalars['String']['input'];
  messageId: Scalars['ID']['input'];
};


export type QueryRolePermissionsArgs = {
  roleId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryUserBoardsArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  workspaceId: Scalars['ID']['input'];
};


export type QueryWorkspaceBoardsArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  includeArchived?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  workspaceId: Scalars['ID']['input'];
};


export type QueryWorkspaceByIdArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type QueryWorkspaceBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryWorkspaceInvitesArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type QueryWorkspaceMembersArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type QueryWorkspaceOverviewArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type QueryWorkspaceRolesArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type QueryWorkspaceUserArgs = {
  userId: Scalars['ID']['input'];
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

export type RegisterExternalFileInput = {
  /** Optional override folder. Defaults to the source module's system folder. */
  folderId?: InputMaybe<Scalars['ID']['input']>;
  mimeType: Scalars['String']['input'];
  name: Scalars['String']['input'];
  projectId: Scalars['ID']['input'];
  /** File size in bytes. Use Float to stay JS-safe (no BigInt serialisation issues). */
  sizeBytes: Scalars['Float']['input'];
  /** Which module is uploading the file. Determines the system folder it lands in. */
  source: VaultFileSource;
  /**
   * ID of the originating entity (conversationId, pageId, boardId, issueId).
   * Nullable — may not yet exist when uploading before the entity is created.
   */
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  workspaceId: Scalars['ID']['input'];
};

/**
 * Returned by registerExternalFile and requestVaultUpload.
 * The client must PUT the file bytes to presignedUrl, then call confirmVaultUpload.
 */
export type RegisterExternalFileResult = {
  __typename?: 'RegisterExternalFileResult';
  expiresAt: Scalars['DateTime']['output'];
  fileId: Scalars['ID']['output'];
  presignedUrl: Scalars['String']['output'];
};

export type RemoveBoardCollaboratorResult = {
  __typename?: 'RemoveBoardCollaboratorResult';
  success: Scalars['Boolean']['output'];
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

export type RemovePageCollaboratorInput = {
  pageId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type RemovePageCollaboratorResult = {
  __typename?: 'RemovePageCollaboratorResult';
  success: Scalars['Boolean']['output'];
};

export type RenameChannelInput = {
  channelId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type RenameFileResult = {
  __typename?: 'RenameFileResult';
  file: VaultFile;
};

export type RenameFolderResult = {
  __typename?: 'RenameFolderResult';
  folder: VaultFolder;
};

export type RenameGroupResult = {
  __typename?: 'RenameGroupResult';
  groupId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type RenamePageInput = {
  pageId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type RenamePageResult = {
  __typename?: 'RenamePageResult';
  page: Page;
};

export type RenameVaultFileInput = {
  fileId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type RenameVaultFolderInput = {
  folderId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type ReopenThreadResult = {
  __typename?: 'ReopenThreadResult';
  success: Scalars['Boolean']['output'];
  threadId: Scalars['ID']['output'];
};

export type ReorderIssueInput = {
  issueId: Scalars['ID']['input'];
  newPosition: Scalars['Float']['input'];
};

export type ReorderIssueResult = {
  __typename?: 'ReorderIssueResult';
  issue: Issue;
};

export type ReorderIssueStatusInput = {
  newPosition: Scalars['Float']['input'];
  statusId: Scalars['ID']['input'];
};

export type ReorderIssueStatusResult = {
  __typename?: 'ReorderIssueStatusResult';
  status: IssueStatus;
};

export type ReorderPageInput = {
  /** null = move to root (remove from parent) */
  newParentId?: InputMaybe<Scalars['ID']['input']>;
  newPosition: Scalars['Float']['input'];
  pageId: Scalars['ID']['input'];
};

export type ReorderPageResult = {
  __typename?: 'ReorderPageResult';
  page: Page;
};

export type RequestIssueDescriptionUploadInput = {
  issueId: Scalars['ID']['input'];
  sizeBytes: Scalars['Int']['input'];
};

export type RequestIssueDescriptionUploadResult = {
  __typename?: 'RequestIssueDescriptionUploadResult';
  descriptionFileId: Scalars['ID']['output'];
  expiresAt: Scalars['DateTime']['output'];
  presignedUrl: Scalars['String']['output'];
};

export type RequestUploadResult = {
  __typename?: 'RequestUploadResult';
  expiresAt: Scalars['DateTime']['output'];
  fileId: Scalars['ID']['output'];
  presignedUrl: Scalars['String']['output'];
};

export type RequestVaultUploadInput = {
  /** null = upload to Home (root level) */
  folderId?: InputMaybe<Scalars['ID']['input']>;
  mimeType: Scalars['String']['input'];
  name: Scalars['String']['input'];
  projectId: Scalars['ID']['input'];
  sizeBytes: Scalars['Int']['input'];
  workspaceId: Scalars['ID']['input'];
};

export type RolePermission = {
  __typename?: 'RolePermission';
  conditions?: Maybe<Scalars['String']['output']>;
  effect: Scalars['String']['output'];
  permission: Permission;
  permissionId: Scalars['ID']['output'];
  roleId: Scalars['ID']['output'];
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

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

export type ToggleFeatureFlagInput = {
  contextId?: InputMaybe<Scalars['ID']['input']>;
  contextType: FlagContextType;
  enabled: Scalars['Boolean']['input'];
  flagKey: Scalars['String']['input'];
};

export type ToggleFlagResult = {
  __typename?: 'ToggleFlagResult';
  enabled: Scalars['Boolean']['output'];
  flagKey: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UnarchiveChannelResult = {
  __typename?: 'UnarchiveChannelResult';
  channelId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UnarchivePageInput = {
  pageId: Scalars['ID']['input'];
};

export type UnarchivePageResult = {
  __typename?: 'UnarchivePageResult';
  page: Page;
};

export type UnlockPageInput = {
  pageId: Scalars['ID']['input'];
};

export type UnlockPageResult = {
  __typename?: 'UnlockPageResult';
  page: Page;
};

export type UnpinVaultFolderInput = {
  folderId: Scalars['ID']['input'];
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

export type UpdateIssueInput = {
  assigneeId?: InputMaybe<Scalars['ID']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  issueId: Scalars['ID']['input'];
  labelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  priority?: InputMaybe<IssuePriority>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateIssueLabelInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  labelId: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateIssueLabelResult = {
  __typename?: 'UpdateIssueLabelResult';
  label: IssueLabel;
};

export type UpdateIssueResult = {
  __typename?: 'UpdateIssueResult';
  issue: Issue;
};

export type UpdateIssueStatusInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  statusId: Scalars['ID']['input'];
};

export type UpdateIssueStatusResult = {
  __typename?: 'UpdateIssueStatusResult';
  status: IssueStatus;
};

export type UpdateProfileInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isPrivate?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProjectRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rank?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateWorkspaceInput = {
  domainWhitelist?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWorkspaceRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rank?: InputMaybe<Scalars['Int']['input']>;
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

/**
 * Result entry for a single file in a batch download URL request.
 * Clients must check status before using the url.
 */
export type VaultBatchDownloadResult = {
  __typename?: 'VaultBatchDownloadResult';
  fileId: Scalars['ID']['output'];
  mimeType: Scalars['String']['output'];
  name: Scalars['String']['output'];
  sizeBytes: Scalars['Float']['output'];
  /**
   * ACTIVE    — url is valid, render normally
   * DELETED   — file was removed; render tombstone ("Attachment deleted")
   * PENDING   — upload not yet confirmed; render placeholder
   * FORBIDDEN — caller is not a member of this file's project
   */
  status: Scalars['String']['output'];
  /** Presigned GET URL valid for 1 hour. Null when status != ACTIVE. */
  url?: Maybe<Scalars['String']['output']>;
};

export type VaultChildrenResult = {
  __typename?: 'VaultChildrenResult';
  files: Array<VaultFile>;
  folders: Array<VaultFolder>;
  hasNextPage: Scalars['Boolean']['output'];
  nextCursor?: Maybe<Scalars['ID']['output']>;
  totalFileCount: Scalars['Int']['output'];
};

export type VaultDownloadUrl = {
  __typename?: 'VaultDownloadUrl';
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  url: Scalars['String']['output'];
};

export type VaultFile = {
  __typename?: 'VaultFile';
  confirmedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  folderId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  mimeType: Scalars['String']['output'];
  name: Scalars['String']['output'];
  projectId: Scalars['ID']['output'];
  s3Key: Scalars['String']['output'];
  /** File size in bytes (Float to safely represent large files >2GB) */
  sizeBytes: Scalars['Float']['output'];
  source: VaultFileSource;
  sourceId?: Maybe<Scalars['ID']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  uploader?: Maybe<VaultUploader>;
  uploaderUserId?: Maybe<Scalars['ID']['output']>;
  workspaceId: Scalars['ID']['output'];
};

export enum VaultFileSource {
  Chat = 'CHAT',
  Page = 'PAGE',
  Task = 'TASK',
  Vault = 'VAULT',
  Whiteboard = 'WHITEBOARD'
}

export type VaultFolder = {
  __typename?: 'VaultFolder';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isSystem: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parentFolderId?: Maybe<Scalars['ID']['output']>;
  projectId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type VaultNode = VaultFile | VaultFolder;

export enum VaultNodeType {
  File = 'FILE',
  Folder = 'FOLDER'
}

export type VaultSidebar = {
  __typename?: 'VaultSidebar';
  pinnedFolders: Array<VaultFolder>;
  systemFolders: Array<VaultFolder>;
};

export enum VaultSortField {
  CreatedAt = 'CREATED_AT',
  Name = 'NAME',
  Size = 'SIZE',
  Type = 'TYPE'
}

export type VaultUploader = {
  __typename?: 'VaultUploader';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};

export type VaultUsage = {
  __typename?: 'VaultUsage';
  percentUsed: Scalars['Float']['output'];
  projectFileCount: Scalars['Int']['output'];
  projectFileCountLimit: Scalars['Int']['output'];
  projectLimitBytes: Scalars['Float']['output'];
  projectReservedBytes: Scalars['Float']['output'];
  projectUsedBytes: Scalars['Float']['output'];
  workspaceFileCount: Scalars['Int']['output'];
  workspaceFileCountLimit: Scalars['Int']['output'];
  workspaceLimitBytes: Scalars['Float']['output'];
  workspaceReservedBytes: Scalars['Float']['output'];
  workspaceUsedBytes: Scalars['Float']['output'];
};

export type Whiteboard = {
  __typename?: 'Whiteboard';
  collaborators?: Maybe<Array<BoardCollaborator>>;
  createdAt: Scalars['DateTime']['output'];
  createdBy: Scalars['ID']['output'];
  creator: UserBasic;
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  elementCount: Scalars['Int']['output'];
  fileSizeBytes: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isArchived: Scalars['Boolean']['output'];
  isLocked: Scalars['Boolean']['output'];
  projectId?: Maybe<Scalars['ID']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  workspaceId: Scalars['ID']['output'];
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

export type WorkspaceInvite = {
  __typename?: 'WorkspaceInvite';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  expiresAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  role: Scalars['String']['output'];
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

export type WorkspaceOverview = {
  __typename?: 'WorkspaceOverview';
  activeProjects: Array<WorkspaceOverviewProject>;
  recentMembers: Array<WorkspaceOverviewMember>;
  totalChannels: Scalars['Int']['output'];
  totalIssues: Scalars['Int']['output'];
  totalMembers: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
  totalProjects: Scalars['Int']['output'];
  urgentIssues: Array<WorkspaceOverviewIssue>;
};

export type WorkspaceOverviewIssue = {
  __typename?: 'WorkspaceOverviewIssue';
  assigneeId?: Maybe<Scalars['ID']['output']>;
  assigneeName?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  number: Scalars['Int']['output'];
  priority: Scalars['String']['output'];
  projectId: Scalars['ID']['output'];
  projectKey: Scalars['String']['output'];
  projectName: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type WorkspaceOverviewMember = {
  __typename?: 'WorkspaceOverviewMember';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  fullName?: Maybe<Scalars['String']['output']>;
  joinedAt: Scalars['String']['output'];
  roleName: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type WorkspaceOverviewProject = {
  __typename?: 'WorkspaceOverviewProject';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  memberCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  openIssues: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type WorkspaceRole = {
  __typename?: 'WorkspaceRole';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isSystem: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
  scopeType: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  workspaceId: Scalars['ID']['output'];
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

export type IssueLabelFieldsFragment = { __typename?: 'IssueLabel', id: string, projectId: string, name: string, color: string, createdAt: any } & { ' $fragmentName'?: 'IssueLabelFieldsFragment' };

export type IssueStatusFieldsFragment = { __typename?: 'IssueStatus', id: string, projectId: string, name: string, color: string, icon?: string | null, position: number, isSystem: boolean, issueCount: number } & { ' $fragmentName'?: 'IssueStatusFieldsFragment' };

export type IssueCardFieldsFragment = { __typename?: 'Issue', id: string, number: number, title: string, priority: IssuePriority, position: number, dueDate?: any | null, updatedAt: any, status: { __typename?: 'IssueStatus', id: string, name: string, color: string, icon?: string | null }, assignee?: { __typename?: 'IssueUser', id: string, fullName?: string | null, avatarUrl?: string | null } | null, labels: Array<{ __typename?: 'IssueLabel', id: string, name: string, color: string }> } & { ' $fragmentName'?: 'IssueCardFieldsFragment' };

export type IssueDetailFieldsFragment = (
  { __typename?: 'Issue', descriptionS3Key?: string | null, createdAt: any, createdBy: { __typename?: 'IssueUser', id: string, fullName?: string | null, avatarUrl?: string | null } }
  & { ' $fragmentRefs'?: { 'IssueCardFieldsFragment': IssueCardFieldsFragment } }
) & { ' $fragmentName'?: 'IssueDetailFieldsFragment' };

export type PageFieldsFragment = { __typename?: 'Page', id: string, title: string, workspaceId: string, projectId: string, parentId?: string | null, icon?: string | null, coverUrl?: string | null, position: number, isArchived: boolean, isLocked: boolean, s3Key?: string | null, createdBy: string, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'PageFieldsFragment' };

export type PageWithCollaboratorsFragment = (
  { __typename?: 'Page', collaborators: Array<{ __typename?: 'PageCollaborator', userId: string, role: PageRole, joinedAt: any, user: { __typename?: 'UserBasic', id: string, fullName: string, email: string, avatarUrl?: string | null } }> }
  & { ' $fragmentRefs'?: { 'PageFieldsFragment': PageFieldsFragment } }
) & { ' $fragmentName'?: 'PageWithCollaboratorsFragment' };

export type PageWithChildrenFragment = (
  { __typename?: 'Page', children: Array<(
    { __typename?: 'Page', children: Array<(
      { __typename?: 'Page', children: Array<(
        { __typename?: 'Page' }
        & { ' $fragmentRefs'?: { 'PageFieldsFragment': PageFieldsFragment } }
      )> }
      & { ' $fragmentRefs'?: { 'PageFieldsFragment': PageFieldsFragment } }
    )> }
    & { ' $fragmentRefs'?: { 'PageFieldsFragment': PageFieldsFragment } }
  )> }
  & { ' $fragmentRefs'?: { 'PageFieldsFragment': PageFieldsFragment } }
) & { ' $fragmentName'?: 'PageWithChildrenFragment' };

export type ProjectMemberFieldsFragment = { __typename?: 'ProjectMember', id: string, userId: string, role?: string | null, joinedAt: string, user: { __typename?: 'User', id: string, fullName?: string | null, email: string, avatarUrl?: string | null } } & { ' $fragmentName'?: 'ProjectMemberFieldsFragment' };

export type GetProjectMembersQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type GetProjectMembersQuery = { __typename?: 'Query', projectMembers: Array<(
    { __typename?: 'ProjectMember' }
    & { ' $fragmentRefs'?: { 'ProjectMemberFieldsFragment': ProjectMemberFieldsFragment } }
  )> };

export type AddProjectMemberMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
}>;


export type AddProjectMemberMutation = { __typename?: 'Mutation', addProjectMember: (
    { __typename?: 'ProjectMember' }
    & { ' $fragmentRefs'?: { 'ProjectMemberFieldsFragment': ProjectMemberFieldsFragment } }
  ) };

export type RemoveProjectMemberMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type RemoveProjectMemberMutation = { __typename?: 'Mutation', removeProjectMember: boolean };

export type UpdateProjectMemberRoleMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
}>;


export type UpdateProjectMemberRoleMutation = { __typename?: 'Mutation', updateProjectMemberRole: (
    { __typename?: 'ProjectMember' }
    & { ' $fragmentRefs'?: { 'ProjectMemberFieldsFragment': ProjectMemberFieldsFragment } }
  ) };

export type LeaveProjectMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type LeaveProjectMutation = { __typename?: 'Mutation', leaveProject: boolean };

export type ProjectRoleFieldsFragment = { __typename?: 'ProjectRole', id: string, name: string, rank: number, description?: string | null, isSystem: boolean, scopeType: string } & { ' $fragmentName'?: 'ProjectRoleFieldsFragment' };

export type RolePermissionFieldsFragment = { __typename?: 'RolePermission', roleId: string, permissionId: string, effect: string, conditions?: string | null, permission: { __typename?: 'Permission', id: string, resource: string, action: string, description?: string | null, module: string } } & { ' $fragmentName'?: 'RolePermissionFieldsFragment' };

export type GetProjectRolesQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
}>;


export type GetProjectRolesQuery = { __typename?: 'Query', projectRoles: Array<(
    { __typename?: 'ProjectRole' }
    & { ' $fragmentRefs'?: { 'ProjectRoleFieldsFragment': ProjectRoleFieldsFragment } }
  )> };

export type GetRolePermissionsQueryVariables = Exact<{
  roleId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
}>;


export type GetRolePermissionsQuery = { __typename?: 'Query', rolePermissions: Array<(
    { __typename?: 'RolePermission' }
    & { ' $fragmentRefs'?: { 'RolePermissionFieldsFragment': RolePermissionFieldsFragment } }
  )> };

export type GetAllPermissionsQueryVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
}>;


export type GetAllPermissionsQuery = { __typename?: 'Query', allPermissions: Array<{ __typename?: 'Permission', id: string, resource: string, action: string, description?: string | null, module: string }> };

export type CreateProjectRoleMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
  input: CreateProjectRoleInput;
}>;


export type CreateProjectRoleMutation = { __typename?: 'Mutation', createProjectRole: (
    { __typename?: 'ProjectRole' }
    & { ' $fragmentRefs'?: { 'ProjectRoleFieldsFragment': ProjectRoleFieldsFragment } }
  ) };

export type UpdateProjectRoleMutationVariables = Exact<{
  roleId: Scalars['ID']['input'];
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
  input: UpdateProjectRoleInput;
}>;


export type UpdateProjectRoleMutation = { __typename?: 'Mutation', updateProjectRole: (
    { __typename?: 'ProjectRole' }
    & { ' $fragmentRefs'?: { 'ProjectRoleFieldsFragment': ProjectRoleFieldsFragment } }
  ) };

export type DeleteProjectRoleMutationVariables = Exact<{
  roleId: Scalars['ID']['input'];
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
}>;


export type DeleteProjectRoleMutation = { __typename?: 'Mutation', deleteProjectRole: boolean };

export type AssignRolePermissionMutationVariables = Exact<{
  roleId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
  permissionId: Scalars['ID']['input'];
  effect: Scalars['String']['input'];
  conditions?: InputMaybe<Scalars['String']['input']>;
}>;


export type AssignRolePermissionMutation = { __typename?: 'Mutation', assignRolePermission: (
    { __typename?: 'RolePermission' }
    & { ' $fragmentRefs'?: { 'RolePermissionFieldsFragment': RolePermissionFieldsFragment } }
  ) };

export type RemoveRolePermissionMutationVariables = Exact<{
  roleId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
  permissionId: Scalars['ID']['input'];
}>;


export type RemoveRolePermissionMutation = { __typename?: 'Mutation', removeRolePermission: boolean };

export type ProjectFieldsFragment = { __typename?: 'Project', id: string, key: string, name: string, description?: string | null, workspaceId: string, isArchived?: boolean | null, activePlugins: Array<string>, createdAt: string, updatedAt: string, members: Array<{ __typename?: 'ProjectMember', userId: string, role?: string | null, joinedAt: string, user: { __typename?: 'User', id: string, fullName?: string | null, avatarUrl?: string | null } }> } & { ' $fragmentName'?: 'ProjectFieldsFragment' };

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

export type GetProjectOverviewQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type GetProjectOverviewQuery = { __typename?: 'Query', projectOverview: { __typename?: 'ProjectOverview', totalIssues: number, openIssues: number, completedIssues: number, overdueIssues: number, pageCount: number, issuesByStatus: Array<{ __typename?: 'IssueStatusCount', statusId: string, name: string, color: string, icon?: string | null, issueCount: number }>, recentIssues: Array<{ __typename?: 'OverviewIssue', id: string, number: number, title: string, priority: string, dueDate?: string | null, updatedAt: string, statusName: string, statusColor: string, assigneeId?: string | null, assigneeName?: string | null, assigneeAvatar?: string | null }>, members: Array<{ __typename?: 'OverviewMember', userId: string, name: string, email: string, avatarUrl?: string | null, roleName?: string | null, roleRank?: number | null, joinedAt: string }> } };

export type UpdateProjectMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
  input: UpdateProjectInput;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject: (
    { __typename?: 'Project' }
    & { ' $fragmentRefs'?: { 'ProjectFieldsFragment': ProjectFieldsFragment } }
  ) };

export type ArchiveProjectMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type ArchiveProjectMutation = { __typename?: 'Mutation', archiveProject: { __typename?: 'Project', id: string, isArchived?: boolean | null } };

export type UnarchiveProjectMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type UnarchiveProjectMutation = { __typename?: 'Mutation', unarchiveProject: { __typename?: 'Project', id: string, isArchived?: boolean | null } };

export type DeleteProjectMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type DeleteProjectMutation = { __typename?: 'Mutation', deleteProject: boolean };

export type ToggleProjectPluginMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
  type: Scalars['String']['input'];
  enable: Scalars['Boolean']['input'];
}>;


export type ToggleProjectPluginMutation = { __typename?: 'Mutation', toggleProjectPlugin: boolean };

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
    & { ' $fragmentRefs'?: { 'UserFragment': UserFragment } }
  ) | null };

export type UserFragment = { __typename?: 'User', id: string, email: string, fullName?: string | null, avatarUrl?: string | null } & { ' $fragmentName'?: 'UserFragment' };

export type VaultFileFieldsFragment = { __typename?: 'VaultFile', id: string, projectId: string, workspaceId: string, folderId?: string | null, uploaderUserId?: string | null, name: string, mimeType: string, sizeBytes: number, s3Key: string, source: VaultFileSource, sourceId?: string | null, status: string, confirmedAt?: any | null, createdAt: any, updatedAt: any, uploader?: { __typename?: 'VaultUploader', id: string, fullName?: string | null, avatarUrl?: string | null } | null } & { ' $fragmentName'?: 'VaultFileFieldsFragment' };

export type VaultFolderFieldsFragment = { __typename?: 'VaultFolder', id: string, projectId: string, parentFolderId?: string | null, name: string, isSystem: boolean, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'VaultFolderFieldsFragment' };

export type BoardFieldsFragment = { __typename?: 'Whiteboard', id: string, workspaceId: string, projectId?: string | null, title: string, description?: string | null, elementCount: number, fileSizeBytes: string, isArchived: boolean, isLocked: boolean, createdBy: string, createdAt: any, updatedAt: any } & { ' $fragmentName'?: 'BoardFieldsFragment' };

export type BoardWithCollaboratorsFragment = (
  { __typename?: 'Whiteboard', collaborators?: Array<{ __typename?: 'BoardCollaborator', userId: string, joinedAt: any, user: { __typename?: 'UserBasic', id: string, fullName: string, email: string, avatarUrl?: string | null } }> | null }
  & { ' $fragmentRefs'?: { 'BoardFieldsFragment': BoardFieldsFragment } }
) & { ' $fragmentName'?: 'BoardWithCollaboratorsFragment' };

export type WorkspaceFragmentFragment = { __typename?: 'Workspace', id: string, name: string, slug: string, logoUrl?: string | null } & { ' $fragmentName'?: 'WorkspaceFragmentFragment' };

export type GetMyWorkspacesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyWorkspacesQuery = { __typename?: 'Query', myWorkspaces: Array<(
    { __typename?: 'Workspace' }
    & { ' $fragmentRefs'?: { 'WorkspaceFragmentFragment': WorkspaceFragmentFragment } }
  )> };

export type GetWorkspaceBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetWorkspaceBySlugQuery = { __typename?: 'Query', workspaceBySlug: { __typename?: 'Workspace', id: string, name: string, slug: string, logoUrl?: string | null } };

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

export type CreateDmMutationVariables = Exact<{
  input: CreateDmInput;
}>;


export type CreateDmMutation = { __typename?: 'Mutation', createDm: { __typename?: 'Conversation', id: string, type: ConversationType, workspaceId: string, projectId?: string | null } };

export type DeleteChannelMutationVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
  channelId: Scalars['ID']['input'];
}>;


export type DeleteChannelMutation = { __typename?: 'Mutation', deleteChannel: { __typename?: 'DeleteChannelResult', success: boolean, channelId: string } };

export type GetProjectDmsQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
}>;


export type GetProjectDmsQuery = { __typename?: 'Query', getProjectDms: Array<{ __typename?: 'ProjectDmItem', id: string, unreadCount: number, updatedAt: any, otherUser: { __typename?: 'DmUserProfile', id: string, fullName: string, avatarUrl?: string | null } }> };

export type RenameChannelMutationVariables = Exact<{
  input: RenameChannelInput;
}>;


export type RenameChannelMutation = { __typename?: 'Mutation', renameChannel: { __typename?: 'Conversation', id: string, name?: string | null, type: ConversationType, workspaceId: string, projectId?: string | null, updatedAt: any } };

export type UnarchiveChannelMutationVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
  channelId: Scalars['ID']['input'];
}>;


export type UnarchiveChannelMutation = { __typename?: 'Mutation', unarchiveChannel: { __typename?: 'UnarchiveChannelResult', success: boolean, channelId: string, name: string } };

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

export type CreateIssueMutationVariables = Exact<{
  input: CreateIssueInput;
}>;


export type CreateIssueMutation = { __typename?: 'Mutation', createIssue: { __typename?: 'CreateIssueResult', issue: (
      { __typename?: 'Issue', id: string }
      & { ' $fragmentRefs'?: { 'IssueCardFieldsFragment': IssueCardFieldsFragment } }
    ) } };

export type MoveIssueStatusMutationVariables = Exact<{
  input: MoveIssueStatusInput;
}>;


export type MoveIssueStatusMutation = { __typename?: 'Mutation', moveIssueStatus: { __typename?: 'MoveIssueStatusResult', issue: (
      { __typename?: 'Issue' }
      & { ' $fragmentRefs'?: { 'IssueCardFieldsFragment': IssueCardFieldsFragment } }
    ) } };

export type ReorderIssueMutationVariables = Exact<{
  input: ReorderIssueInput;
}>;


export type ReorderIssueMutation = { __typename?: 'Mutation', reorderIssue: { __typename?: 'ReorderIssueResult', issue: (
      { __typename?: 'Issue' }
      & { ' $fragmentRefs'?: { 'IssueCardFieldsFragment': IssueCardFieldsFragment } }
    ) } };

export type GetIssueQueryVariables = Exact<{
  issueId: Scalars['ID']['input'];
}>;


export type GetIssueQuery = { __typename?: 'Query', getIssue: (
    { __typename?: 'Issue' }
    & { ' $fragmentRefs'?: { 'IssueDetailFieldsFragment': IssueDetailFieldsFragment } }
  ) };

export type GetIssueDescriptionUrlQueryVariables = Exact<{
  issueId: Scalars['ID']['input'];
}>;


export type GetIssueDescriptionUrlQuery = { __typename?: 'Query', getIssueDescriptionUrl: { __typename?: 'IssueDescriptionUrl', url: string } };

export type UpdateIssueMutationVariables = Exact<{
  input: UpdateIssueInput;
}>;


export type UpdateIssueMutation = { __typename?: 'Mutation', updateIssue: { __typename?: 'UpdateIssueResult', issue: (
      { __typename?: 'Issue' }
      & { ' $fragmentRefs'?: { 'IssueDetailFieldsFragment': IssueDetailFieldsFragment } }
    ) } };

export type DeleteIssueMutationVariables = Exact<{
  input: DeleteIssueInput;
}>;


export type DeleteIssueMutation = { __typename?: 'Mutation', deleteIssue: { __typename?: 'DeleteResult', success: boolean } };

export type RequestIssueDescriptionUploadMutationVariables = Exact<{
  input: RequestIssueDescriptionUploadInput;
}>;


export type RequestIssueDescriptionUploadMutation = { __typename?: 'Mutation', requestIssueDescriptionUpload: { __typename?: 'RequestIssueDescriptionUploadResult', presignedUrl: string, descriptionFileId: string } };

export type ConfirmIssueDescriptionUploadMutationVariables = Exact<{
  input: ConfirmIssueDescriptionUploadInput;
}>;


export type ConfirmIssueDescriptionUploadMutation = { __typename?: 'Mutation', confirmIssueDescriptionUpload: { __typename?: 'ConfirmIssueDescriptionUploadResult', issue: (
      { __typename?: 'Issue' }
      & { ' $fragmentRefs'?: { 'IssueDetailFieldsFragment': IssueDetailFieldsFragment } }
    ) } };

export type CreateIssueLabelMutationVariables = Exact<{
  input: CreateIssueLabelInput;
}>;


export type CreateIssueLabelMutation = { __typename?: 'Mutation', createIssueLabel: { __typename?: 'CreateIssueLabelResult', label: (
      { __typename?: 'IssueLabel' }
      & { ' $fragmentRefs'?: { 'IssueLabelFieldsFragment': IssueLabelFieldsFragment } }
    ) } };

export type UpdateIssueLabelMutationVariables = Exact<{
  input: UpdateIssueLabelInput;
}>;


export type UpdateIssueLabelMutation = { __typename?: 'Mutation', updateIssueLabel: { __typename?: 'UpdateIssueLabelResult', label: (
      { __typename?: 'IssueLabel' }
      & { ' $fragmentRefs'?: { 'IssueLabelFieldsFragment': IssueLabelFieldsFragment } }
    ) } };

export type DeleteIssueLabelMutationVariables = Exact<{
  input: DeleteIssueLabelInput;
}>;


export type DeleteIssueLabelMutation = { __typename?: 'Mutation', deleteIssueLabel: { __typename?: 'DeleteResult', success: boolean } };

export type CreateIssueStatusMutationVariables = Exact<{
  input: CreateIssueStatusInput;
}>;


export type CreateIssueStatusMutation = { __typename?: 'Mutation', createIssueStatus: { __typename?: 'CreateIssueStatusResult', status: (
      { __typename?: 'IssueStatus' }
      & { ' $fragmentRefs'?: { 'IssueStatusFieldsFragment': IssueStatusFieldsFragment } }
    ) } };

export type UpdateIssueStatusMutationVariables = Exact<{
  input: UpdateIssueStatusInput;
}>;


export type UpdateIssueStatusMutation = { __typename?: 'Mutation', updateIssueStatus: { __typename?: 'UpdateIssueStatusResult', status: (
      { __typename?: 'IssueStatus' }
      & { ' $fragmentRefs'?: { 'IssueStatusFieldsFragment': IssueStatusFieldsFragment } }
    ) } };

export type ReorderIssueStatusMutationVariables = Exact<{
  input: ReorderIssueStatusInput;
}>;


export type ReorderIssueStatusMutation = { __typename?: 'Mutation', reorderIssueStatus: { __typename?: 'ReorderIssueStatusResult', status: (
      { __typename?: 'IssueStatus' }
      & { ' $fragmentRefs'?: { 'IssueStatusFieldsFragment': IssueStatusFieldsFragment } }
    ) } };

export type DeleteIssueStatusMutationVariables = Exact<{
  input: DeleteIssueStatusInput;
}>;


export type DeleteIssueStatusMutation = { __typename?: 'Mutation', deleteIssueStatus: { __typename?: 'DeleteResult', success: boolean } };

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

export type AddPageCollaboratorsMutationVariables = Exact<{
  input: AddPageCollaboratorsInput;
}>;


export type AddPageCollaboratorsMutation = { __typename?: 'Mutation', addPageCollaborators: { __typename?: 'AddPageCollaboratorsResult', addedCollaborators: Array<{ __typename?: 'PageCollaborator', userId: string, role: PageRole, user: { __typename?: 'UserBasic', id: string, fullName: string, avatarUrl?: string | null } }> } };

export type CreatePageMutationVariables = Exact<{
  input: CreatePageInput;
}>;


export type CreatePageMutation = { __typename?: 'Mutation', createPage: { __typename?: 'CreatePageResult', page: { __typename?: 'Page', id: string, title: string, workspaceId: string, projectId: string, parentId?: string | null, icon?: string | null, coverUrl?: string | null, position: number, isArchived: boolean, isLocked: boolean, s3Key?: string | null, createdBy: string, createdAt: any, updatedAt: any } } };

export type DeletePageMutationVariables = Exact<{
  input: DeletePageInput;
}>;


export type DeletePageMutation = { __typename?: 'Mutation', deletePage: { __typename?: 'DeletePageResult', success: boolean, pageId: string } };

export type GetActivePageCollaboratorsQueryVariables = Exact<{
  pageId: Scalars['ID']['input'];
}>;


export type GetActivePageCollaboratorsQuery = { __typename?: 'Query', getActivePageCollaborators: Array<{ __typename?: 'PageCollaborator', userId: string, role: PageRole, user: { __typename?: 'UserBasic', id: string, fullName: string, avatarUrl?: string | null } }> };

export type GetPageCollaboratorsQueryVariables = Exact<{
  pageId: Scalars['ID']['input'];
}>;


export type GetPageCollaboratorsQuery = { __typename?: 'Query', getPageCollaborators: Array<{ __typename?: 'PageCollaborator', userId: string, role: PageRole, joinedAt: any, user: { __typename?: 'UserBasic', id: string, fullName: string, email: string, avatarUrl?: string | null } }> };

export type GetPageQueryVariables = Exact<{
  pageId: Scalars['ID']['input'];
}>;


export type GetPageQuery = { __typename?: 'Query', getPage: { __typename?: 'Page', id: string, title: string, workspaceId: string, projectId: string, parentId?: string | null, icon?: string | null, coverUrl?: string | null, position: number, isArchived: boolean, isLocked: boolean, s3Key?: string | null, createdBy: string, createdAt: any, updatedAt: any } };

export type GetProjectPagesQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type GetProjectPagesQuery = { __typename?: 'Query', getProjectPages: Array<(
    { __typename?: 'Page' }
    & { ' $fragmentRefs'?: { 'PageWithChildrenFragment': PageWithChildrenFragment } }
  )> };

export type GetPageSnapshotQueryVariables = Exact<{
  pageId: Scalars['ID']['input'];
}>;


export type GetPageSnapshotQuery = { __typename?: 'Query', getPageSnapshot: { __typename?: 'PageSnapshot', snapshot: string, lastStreamId: string, snapshotTimestamp?: any | null } };

export type RemovePageCollaboratorMutationVariables = Exact<{
  input: RemovePageCollaboratorInput;
}>;


export type RemovePageCollaboratorMutation = { __typename?: 'Mutation', removePageCollaborator: { __typename?: 'RemovePageCollaboratorResult', success: boolean } };

export type RenamePageMutationVariables = Exact<{
  input: RenamePageInput;
}>;


export type RenamePageMutation = { __typename?: 'Mutation', renamePage: { __typename?: 'RenamePageResult', page: { __typename?: 'Page', id: string, title: string, projectId: string, parentId?: string | null, icon?: string | null, position: number, isArchived: boolean, isLocked: boolean, updatedAt: any } } };

export type ReorderPageMutationVariables = Exact<{
  input: ReorderPageInput;
}>;


export type ReorderPageMutation = { __typename?: 'Mutation', reorderPage: { __typename?: 'ReorderPageResult', page: { __typename?: 'Page', id: string, position: number, parentId?: string | null, updatedAt: any } } };

export type ArchivePageMutationVariables = Exact<{
  input: ArchivePageInput;
}>;


export type ArchivePageMutation = { __typename?: 'Mutation', archivePage: { __typename?: 'ArchivePageResult', page: { __typename?: 'Page', id: string, isArchived: boolean, updatedAt: any } } };

export type UnarchivePageMutationVariables = Exact<{
  input: UnarchivePageInput;
}>;


export type UnarchivePageMutation = { __typename?: 'Mutation', unarchivePage: { __typename?: 'UnarchivePageResult', page: { __typename?: 'Page', id: string, isArchived: boolean, updatedAt: any } } };

export type LockPageMutationVariables = Exact<{
  input: LockPageInput;
}>;


export type LockPageMutation = { __typename?: 'Mutation', lockPage: { __typename?: 'LockPageResult', page: { __typename?: 'Page', id: string, isLocked: boolean, updatedAt: any } } };

export type UnlockPageMutationVariables = Exact<{
  input: UnlockPageInput;
}>;


export type UnlockPageMutation = { __typename?: 'Mutation', unlockPage: { __typename?: 'UnlockPageResult', page: { __typename?: 'Page', id: string, isLocked: boolean, updatedAt: any } } };

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

export type CreateVaultFolderMutationVariables = Exact<{
  input: CreateVaultFolderInput;
}>;


export type CreateVaultFolderMutation = { __typename?: 'Mutation', createVaultFolder: { __typename?: 'CreateFolderResult', folder: (
      { __typename?: 'VaultFolder' }
      & { ' $fragmentRefs'?: { 'VaultFolderFieldsFragment': VaultFolderFieldsFragment } }
    ) } };

export type DeleteVaultFileMutationVariables = Exact<{
  input: DeleteVaultFileInput;
}>;


export type DeleteVaultFileMutation = { __typename?: 'Mutation', deleteVaultFile: { __typename?: 'DeleteResult', success: boolean, id: string } };

export type DeleteVaultFolderMutationVariables = Exact<{
  input: DeleteVaultFolderInput;
}>;


export type DeleteVaultFolderMutation = { __typename?: 'Mutation', deleteVaultFolder: { __typename?: 'DeleteResult', success: boolean, id: string } };

export type GetVaultAncestorsQueryVariables = Exact<{
  folderId: Scalars['ID']['input'];
}>;


export type GetVaultAncestorsQuery = { __typename?: 'Query', getVaultAncestors: Array<(
    { __typename?: 'VaultFolder' }
    & { ' $fragmentRefs'?: { 'VaultFolderFieldsFragment': VaultFolderFieldsFragment } }
  )> };

export type GetVaultChildrenQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
  parentFolderId?: InputMaybe<Scalars['ID']['input']>;
  cursor?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<VaultSortField>;
  sortDir?: InputMaybe<SortDirection>;
}>;


export type GetVaultChildrenQuery = { __typename?: 'Query', getVaultChildren: { __typename?: 'VaultChildrenResult', totalFileCount: number, hasNextPage: boolean, nextCursor?: string | null, folders: Array<(
      { __typename?: 'VaultFolder' }
      & { ' $fragmentRefs'?: { 'VaultFolderFieldsFragment': VaultFolderFieldsFragment } }
    )>, files: Array<(
      { __typename?: 'VaultFile' }
      & { ' $fragmentRefs'?: { 'VaultFileFieldsFragment': VaultFileFieldsFragment } }
    )> } };

export type GetVaultDownloadUrlQueryVariables = Exact<{
  fileId: Scalars['ID']['input'];
}>;


export type GetVaultDownloadUrlQuery = { __typename?: 'Query', getVaultDownloadUrl: { __typename?: 'VaultDownloadUrl', url: string, expiresAt?: any | null } };

export type GetVaultNodeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  type: VaultNodeType;
}>;


export type GetVaultNodeQuery = { __typename?: 'Query', getVaultNode:
    | (
      { __typename?: 'VaultFile' }
      & { ' $fragmentRefs'?: { 'VaultFileFieldsFragment': VaultFileFieldsFragment } }
    )
    | (
      { __typename?: 'VaultFolder' }
      & { ' $fragmentRefs'?: { 'VaultFolderFieldsFragment': VaultFolderFieldsFragment } }
    )
   };

export type GetVaultSidebarQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type GetVaultSidebarQuery = { __typename?: 'Query', getVaultSidebar: { __typename?: 'VaultSidebar', pinnedFolders: Array<(
      { __typename?: 'VaultFolder' }
      & { ' $fragmentRefs'?: { 'VaultFolderFieldsFragment': VaultFolderFieldsFragment } }
    )>, systemFolders: Array<(
      { __typename?: 'VaultFolder' }
      & { ' $fragmentRefs'?: { 'VaultFolderFieldsFragment': VaultFolderFieldsFragment } }
    )> } };

export type GetVaultUsageQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type GetVaultUsageQuery = { __typename?: 'Query', getVaultUsage: { __typename?: 'VaultUsage', projectUsedBytes: number, projectLimitBytes: number, workspaceUsedBytes: number, workspaceLimitBytes: number, projectFileCount: number, projectFileCountLimit: number } };

export type MoveVaultFileMutationVariables = Exact<{
  input: MoveVaultFileInput;
}>;


export type MoveVaultFileMutation = { __typename?: 'Mutation', moveVaultFile: { __typename?: 'MoveFileResult', file: (
      { __typename?: 'VaultFile' }
      & { ' $fragmentRefs'?: { 'VaultFileFieldsFragment': VaultFileFieldsFragment } }
    ) } };

export type MoveVaultFolderMutationVariables = Exact<{
  input: MoveVaultFolderInput;
}>;


export type MoveVaultFolderMutation = { __typename?: 'Mutation', moveVaultFolder: { __typename?: 'MoveFolderResult', folder: (
      { __typename?: 'VaultFolder' }
      & { ' $fragmentRefs'?: { 'VaultFolderFieldsFragment': VaultFolderFieldsFragment } }
    ) } };

export type PinVaultFolderMutationVariables = Exact<{
  input: PinVaultFolderInput;
}>;


export type PinVaultFolderMutation = { __typename?: 'Mutation', pinVaultFolder: { __typename?: 'PinFolderResult', folder: (
      { __typename?: 'VaultFolder' }
      & { ' $fragmentRefs'?: { 'VaultFolderFieldsFragment': VaultFolderFieldsFragment } }
    ) } };

export type RenameVaultFileMutationVariables = Exact<{
  input: RenameVaultFileInput;
}>;


export type RenameVaultFileMutation = { __typename?: 'Mutation', renameVaultFile: { __typename?: 'RenameFileResult', file: (
      { __typename?: 'VaultFile' }
      & { ' $fragmentRefs'?: { 'VaultFileFieldsFragment': VaultFileFieldsFragment } }
    ) } };

export type RenameVaultFolderMutationVariables = Exact<{
  input: RenameVaultFolderInput;
}>;


export type RenameVaultFolderMutation = { __typename?: 'Mutation', renameVaultFolder: { __typename?: 'RenameFolderResult', folder: (
      { __typename?: 'VaultFolder' }
      & { ' $fragmentRefs'?: { 'VaultFolderFieldsFragment': VaultFolderFieldsFragment } }
    ) } };

export type UnpinVaultFolderMutationVariables = Exact<{
  input: UnpinVaultFolderInput;
}>;


export type UnpinVaultFolderMutation = { __typename?: 'Mutation', unpinVaultFolder: { __typename?: 'DeleteResult', success: boolean, id: string } };

export type RequestVaultUploadMutationVariables = Exact<{
  input: RequestVaultUploadInput;
}>;


export type RequestVaultUploadMutation = { __typename?: 'Mutation', requestVaultUpload: { __typename?: 'RequestUploadResult', fileId: string, presignedUrl: string, expiresAt: any } };

export type ConfirmVaultUploadMutationVariables = Exact<{
  input: ConfirmVaultUploadInput;
}>;


export type ConfirmVaultUploadMutation = { __typename?: 'Mutation', confirmVaultUpload: { __typename?: 'ConfirmUploadResult', file: { __typename?: 'VaultFile', id: string, name: string, mimeType: string, sizeBytes: number, status: string, folderId?: string | null, projectId: string, workspaceId: string, source: VaultFileSource, sourceId?: string | null, confirmedAt?: any | null, createdAt: any, updatedAt: any, uploader?: { __typename?: 'VaultUploader', id: string, fullName?: string | null, avatarUrl?: string | null } | null } } };

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

export type AddBoardCollaboratorsMutationVariables = Exact<{
  boardId: Scalars['ID']['input'];
  userIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type AddBoardCollaboratorsMutation = { __typename?: 'Mutation', addBoardCollaborators: { __typename?: 'AddBoardCollaboratorsResult', success: boolean, addedCount: number, skippedCount: number } };

export type GetBoardCollaboratorsQueryVariables = Exact<{
  boardId: Scalars['ID']['input'];
}>;


export type GetBoardCollaboratorsQuery = { __typename?: 'Query', boardCollaborators: Array<{ __typename?: 'BoardCollaborator', userId: string, joinedAt: any, user: { __typename?: 'UserBasic', id: string, fullName: string, email: string, avatarUrl?: string | null } }> };

export type ArchiveBoardMutationVariables = Exact<{
  boardId: Scalars['ID']['input'];
}>;


export type ArchiveBoardMutation = { __typename?: 'Mutation', archiveBoard: { __typename?: 'Whiteboard', id: string, isArchived: boolean, updatedAt: any } };

export type CreateBoardMutationVariables = Exact<{
  input: CreateBoardInput;
}>;


export type CreateBoardMutation = { __typename?: 'Mutation', createBoard: { __typename?: 'BoardPayload', board: { __typename?: 'Whiteboard', id: string, workspaceId: string, projectId?: string | null, title: string, description?: string | null, createdAt: any }, addedCollaborators: Array<{ __typename?: 'BoardCollaborator', userId: string, joinedAt: any }> } };

export type DeleteBoardMutationVariables = Exact<{
  boardId: Scalars['ID']['input'];
}>;


export type DeleteBoardMutation = { __typename?: 'Mutation', deleteBoard: { __typename?: 'DeleteBoardResult', success: boolean, boardId: string } };

export type GetBoardQueryVariables = Exact<{
  boardId: Scalars['ID']['input'];
}>;


export type GetBoardQuery = { __typename?: 'Query', getBoard?: { __typename?: 'Whiteboard', id: string, title: string, description?: string | null, workspaceId: string, projectId?: string | null, createdBy: string, createdAt: any, updatedAt: any, isLocked: boolean, isArchived: boolean } | null };

export type GetActiveCollaboratorsQueryVariables = Exact<{
  boardId: Scalars['ID']['input'];
}>;


export type GetActiveCollaboratorsQuery = { __typename?: 'Query', activeCollaborators: Array<{ __typename?: 'ActiveCollaborator', userId: string, connectionId: string, joinedAt: any, lastSeenAt: any, cursorPosition?: { __typename?: 'CursorPosition', x: number, y: number } | null }> };

export type GetBoardSnapshotQueryVariables = Exact<{
  boardId: Scalars['ID']['input'];
  clientSnapshot?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetBoardSnapshotQuery = { __typename?: 'Query', getBoardSnapshot: { __typename?: 'BoardSnapshot', boardId: string, snapshot: string, lastStreamId?: string | null, snapshotTimestamp?: any | null } };

export type GetUserBoardsQueryVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
  projectId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetUserBoardsQuery = { __typename?: 'Query', userBoards: { __typename?: 'BoardConnection', nextCursor?: string | null, boards: Array<{ __typename?: 'Whiteboard', id: string, workspaceId: string, projectId?: string | null, title: string, description?: string | null, elementCount: number, fileSizeBytes: string, isArchived: boolean, isLocked: boolean, createdBy: string, createdAt: any, updatedAt: any }> } };

export type LockBoardMutationVariables = Exact<{
  boardId: Scalars['ID']['input'];
}>;


export type LockBoardMutation = { __typename?: 'Mutation', lockBoard: { __typename?: 'Whiteboard', id: string, isLocked: boolean, updatedAt: any } };

export type RemoveBoardCollaboratorMutationVariables = Exact<{
  boardId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type RemoveBoardCollaboratorMutation = { __typename?: 'Mutation', removeBoardCollaborator: { __typename?: 'RemoveBoardCollaboratorResult', success: boolean } };

export type RenameBoardMutationVariables = Exact<{
  boardId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
}>;


export type RenameBoardMutation = { __typename?: 'Mutation', renameBoard: { __typename?: 'Whiteboard', id: string, title: string, updatedAt: any } };

export type UnarchiveBoardMutationVariables = Exact<{
  boardId: Scalars['ID']['input'];
}>;


export type UnarchiveBoardMutation = { __typename?: 'Mutation', unarchiveBoard: { __typename?: 'Whiteboard', id: string, isArchived: boolean, updatedAt: any } };

export type UnlockBoardMutationVariables = Exact<{
  boardId: Scalars['ID']['input'];
}>;


export type UnlockBoardMutation = { __typename?: 'Mutation', unlockBoard: { __typename?: 'Whiteboard', id: string, isLocked: boolean, updatedAt: any } };

export type UpdateBoardDescriptionMutationVariables = Exact<{
  boardId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateBoardDescriptionMutation = { __typename?: 'Mutation', updateBoardDescription: { __typename?: 'Whiteboard', id: string, description?: string | null, updatedAt: any } };

export type RegisterExternalFileMutationVariables = Exact<{
  input: RegisterExternalFileInput;
}>;


export type RegisterExternalFileMutation = { __typename?: 'Mutation', registerExternalFile: { __typename?: 'RegisterExternalFileResult', fileId: string, presignedUrl: string, expiresAt: any } };

export type ConfirmVaultUploadExternalMutationVariables = Exact<{
  input: ConfirmVaultUploadInput;
}>;


export type ConfirmVaultUploadExternalMutation = { __typename?: 'Mutation', confirmVaultUpload: { __typename?: 'ConfirmUploadResult', file: { __typename?: 'VaultFile', id: string, name: string, mimeType: string, sizeBytes: number, status: string } } };

export type GetBatchDownloadUrlsQueryVariables = Exact<{
  fileIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type GetBatchDownloadUrlsQuery = { __typename?: 'Query', getBatchDownloadUrls: Array<{ __typename?: 'VaultBatchDownloadResult', fileId: string, url?: string | null, status: string, name: string, mimeType: string, sizeBytes: number }> };

export type MarkFilesUnreferencedMutationVariables = Exact<{
  input: MarkFilesUnreferencedInput;
}>;


export type MarkFilesUnreferencedMutation = { __typename?: 'Mutation', markFilesUnreferenced: { __typename?: 'MarkFilesUnreferencedResult', markedCount: number } };

export type GetVaultUsageSharedQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type GetVaultUsageSharedQuery = { __typename?: 'Query', getVaultUsage: { __typename?: 'VaultUsage', projectUsedBytes: number, projectReservedBytes: number, projectLimitBytes: number, projectFileCount: number, projectFileCountLimit: number, workspaceUsedBytes: number, workspaceReservedBytes: number, workspaceLimitBytes: number, percentUsed: number } };

export type GetActiveContextQueryVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
  projectId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetActiveContextQuery = { __typename?: 'Query', activeContext: { __typename?: 'ActiveUserContext', userId: string, workspaceId: string, projectId?: string | null, workspaceRole?: string | null, projectRole?: string | null, grantedPermissions: Array<string>, featureFlags: Array<{ __typename?: 'ActiveFeatureFlag', key: string, enabled: boolean }> } };

export type GetProjectIssuesQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type GetProjectIssuesQuery = { __typename?: 'Query', getProjectIssues: Array<(
    { __typename?: 'Issue' }
    & { ' $fragmentRefs'?: { 'IssueCardFieldsFragment': IssueCardFieldsFragment } }
  )> };

export type GetIssueStatusesQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type GetIssueStatusesQuery = { __typename?: 'Query', getIssueStatuses: Array<(
    { __typename?: 'IssueStatus' }
    & { ' $fragmentRefs'?: { 'IssueStatusFieldsFragment': IssueStatusFieldsFragment } }
  )> };

export type GetIssueLabelsQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type GetIssueLabelsQuery = { __typename?: 'Query', getIssueLabels: Array<(
    { __typename?: 'IssueLabel' }
    & { ' $fragmentRefs'?: { 'IssueLabelFieldsFragment': IssueLabelFieldsFragment } }
  )> };

export const MessageRecoveryFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageRecoveryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChatMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"streamId"}},{"kind":"Field","name":{"kind":"Name","value":"sequence"}},{"kind":"Field","name":{"kind":"Name","value":"conversationId"}},{"kind":"Field","name":{"kind":"Name","value":"authorUserId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<MessageRecoveryFieldsFragment, unknown>;
export const ConversationFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConversationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"description"},"name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentMessageId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"unreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]} as unknown as DocumentNode<ConversationFieldsFragment, unknown>;
export const ConversationMemberFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConversationMemberFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConversationMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isMuted"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<ConversationMemberFieldsFragment, unknown>;
export const IssueLabelFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueLabelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueLabel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<IssueLabelFieldsFragment, unknown>;
export const IssueStatusFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"issueCount"}}]}}]} as unknown as DocumentNode<IssueStatusFieldsFragment, unknown>;
export const IssueCardFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<IssueCardFieldsFragment, unknown>;
export const IssueDetailFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCardFields"}},{"kind":"Field","name":{"kind":"Name","value":"descriptionS3Key"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<IssueDetailFieldsFragment, unknown>;
export const PageFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"coverUrl"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"s3Key"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PageFieldsFragment, unknown>;
export const PageWithCollaboratorsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageWithCollaborators"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}},{"kind":"Field","name":{"kind":"Name","value":"collaborators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"coverUrl"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"s3Key"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PageWithCollaboratorsFragment, unknown>;
export const PageWithChildrenFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageWithChildren"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"coverUrl"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"s3Key"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PageWithChildrenFragment, unknown>;
export const ProjectMemberFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectMemberFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<ProjectMemberFieldsFragment, unknown>;
export const ProjectRoleFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectRoleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"scopeType"}}]}}]} as unknown as DocumentNode<ProjectRoleFieldsFragment, unknown>;
export const RolePermissionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RolePermissionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RolePermission"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"permissionId"}},{"kind":"Field","name":{"kind":"Name","value":"effect"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"module"}}]}}]}}]} as unknown as DocumentNode<RolePermissionFieldsFragment, unknown>;
export const ProjectFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"activePlugins"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<ProjectFieldsFragment, unknown>;
export const UserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]} as unknown as DocumentNode<UserFragment, unknown>;
export const VaultFileFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"uploaderUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"sizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"s3Key"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<VaultFileFieldsFragment, unknown>;
export const VaultFolderFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFolderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<VaultFolderFieldsFragment, unknown>;
export const BoardFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BoardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Whiteboard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"elementCount"}},{"kind":"Field","name":{"kind":"Name","value":"fileSizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<BoardFieldsFragment, unknown>;
export const BoardWithCollaboratorsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BoardWithCollaborators"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Whiteboard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BoardFields"}},{"kind":"Field","name":{"kind":"Name","value":"collaborators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BoardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Whiteboard"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"elementCount"}},{"kind":"Field","name":{"kind":"Name","value":"fileSizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<BoardWithCollaboratorsFragment, unknown>;
export const WorkspaceFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WorkspaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Workspace"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}}]} as unknown as DocumentNode<WorkspaceFragmentFragment, unknown>;
export const GetMissingMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMissingMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"afterSequence"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messagesDelta"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"afterSequence"},"value":{"kind":"Variable","name":{"kind":"Name","value":"afterSequence"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageRecoveryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"lastSequence"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageRecoveryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChatMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"streamId"}},{"kind":"Field","name":{"kind":"Name","value":"sequence"}},{"kind":"Field","name":{"kind":"Name","value":"conversationId"}},{"kind":"Field","name":{"kind":"Name","value":"authorUserId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetMissingMessagesQuery, GetMissingMessagesQueryVariables>;
export const GetHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"beforeSequence"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"history"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"beforeSequence"},"value":{"kind":"Variable","name":{"kind":"Name","value":"beforeSequence"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MessageRecoveryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasMore"}},{"kind":"Field","name":{"kind":"Name","value":"minSequence"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MessageRecoveryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ChatMessage"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"streamId"}},{"kind":"Field","name":{"kind":"Name","value":"sequence"}},{"kind":"Field","name":{"kind":"Name","value":"conversationId"}},{"kind":"Field","name":{"kind":"Name","value":"authorUserId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetHistoryQuery, GetHistoryQueryVariables>;
export const GetUserConversationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserConversations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ConversationType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeArchived"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserConversations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeArchived"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeArchived"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConversationFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConversationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"description"},"name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentMessageId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"unreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]} as unknown as DocumentNode<GetUserConversationsQuery, GetUserConversationsQueryVariables>;
export const GetConversationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetConversation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getConversation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConversationFields"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConversationMemberFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConversationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Conversation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","alias":{"kind":"Name","value":"description"},"name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentMessageId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"unreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"authorUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConversationMemberFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConversationMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"isMuted"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<GetConversationQuery, GetConversationQueryVariables>;
export const GetUsersByIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersByIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersByIds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<GetUsersByIdsQuery, GetUsersByIdsQueryVariables>;
export const GetProjectMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectMemberFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectMemberFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<GetProjectMembersQuery, GetProjectMembersQueryVariables>;
export const AddProjectMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddProjectMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addProjectMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectMemberFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectMemberFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<AddProjectMemberMutation, AddProjectMemberMutationVariables>;
export const RemoveProjectMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveProjectMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeProjectMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}]}}]} as unknown as DocumentNode<RemoveProjectMemberMutation, RemoveProjectMemberMutationVariables>;
export const UpdateProjectMemberRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProjectMemberRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProjectMemberRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectMemberFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectMemberFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectMember"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<UpdateProjectMemberRoleMutation, UpdateProjectMemberRoleMutationVariables>;
export const LeaveProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LeaveProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}]}]}}]} as unknown as DocumentNode<LeaveProjectMutation, LeaveProjectMutationVariables>;
export const GetProjectRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectRoleFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectRoleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"scopeType"}}]}}]} as unknown as DocumentNode<GetProjectRolesQuery, GetProjectRolesQueryVariables>;
export const GetRolePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRolePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rolePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RolePermissionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RolePermissionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RolePermission"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"permissionId"}},{"kind":"Field","name":{"kind":"Name","value":"effect"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"module"}}]}}]}}]} as unknown as DocumentNode<GetRolePermissionsQuery, GetRolePermissionsQueryVariables>;
export const GetAllPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allPermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"module"}}]}}]}}]} as unknown as DocumentNode<GetAllPermissionsQuery, GetAllPermissionsQueryVariables>;
export const CreateProjectRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProjectRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProjectRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProjectRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectRoleFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectRoleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"scopeType"}}]}}]} as unknown as DocumentNode<CreateProjectRoleMutation, CreateProjectRoleMutationVariables>;
export const UpdateProjectRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProjectRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProjectRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProjectRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectRoleFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectRoleFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectRole"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"scopeType"}}]}}]} as unknown as DocumentNode<UpdateProjectRoleMutation, UpdateProjectRoleMutationVariables>;
export const DeleteProjectRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProjectRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProjectRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}]}]}}]} as unknown as DocumentNode<DeleteProjectRoleMutation, DeleteProjectRoleMutationVariables>;
export const AssignRolePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignRolePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"effect"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conditions"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignRolePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"effect"},"value":{"kind":"Variable","name":{"kind":"Name","value":"effect"}}},{"kind":"Argument","name":{"kind":"Name","value":"conditions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conditions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RolePermissionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RolePermissionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RolePermission"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"permissionId"}},{"kind":"Field","name":{"kind":"Name","value":"effect"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"module"}}]}}]}}]} as unknown as DocumentNode<AssignRolePermissionMutation, AssignRolePermissionMutationVariables>;
export const RemoveRolePermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveRolePermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeRolePermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissionId"}}}]}]}}]} as unknown as DocumentNode<RemoveRolePermissionMutation, RemoveRolePermissionMutationVariables>;
export const GetProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"activePlugins"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectQuery, GetProjectQueryVariables>;
export const MyProjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyProjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myProjects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"activePlugins"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<MyProjectsQuery, MyProjectsQueryVariables>;
export const GetProjectBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"activePlugins"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectBySlugQuery, GetProjectBySlugQueryVariables>;
export const GetProjectOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectOverview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectOverview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalIssues"}},{"kind":"Field","name":{"kind":"Name","value":"openIssues"}},{"kind":"Field","name":{"kind":"Name","value":"completedIssues"}},{"kind":"Field","name":{"kind":"Name","value":"overdueIssues"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}},{"kind":"Field","name":{"kind":"Name","value":"issuesByStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"statusId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"issueCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recentIssues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"statusName"}},{"kind":"Field","name":{"kind":"Name","value":"statusColor"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeId"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeName"}},{"kind":"Field","name":{"kind":"Name","value":"assigneeAvatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}},{"kind":"Field","name":{"kind":"Name","value":"roleRank"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectOverviewQuery, GetProjectOverviewQueryVariables>;
export const UpdateProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProjectInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"activePlugins"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const ArchiveProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}}]}}]}}]} as unknown as DocumentNode<ArchiveProjectMutation, ArchiveProjectMutationVariables>;
export const UnarchiveProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnarchiveProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unarchiveProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}}]}}]}}]} as unknown as DocumentNode<UnarchiveProjectMutation, UnarchiveProjectMutationVariables>;
export const DeleteProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}]}]}}]} as unknown as DocumentNode<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const ToggleProjectPluginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleProjectPlugin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enable"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleProjectPlugin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"enable"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enable"}}}]}]}}]} as unknown as DocumentNode<ToggleProjectPluginMutation, ToggleProjectPluginMutationVariables>;
export const SessionSyncUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SessionSyncUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clerkId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"clerkId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clerkId"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"fullName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}}},{"kind":"Argument","name":{"kind":"Name","value":"avatarUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]} as unknown as DocumentNode<SessionSyncUserMutation, SessionSyncUserMutationVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"User"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"User"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetMyWorkspacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyWorkspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myWorkspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WorkspaceFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WorkspaceFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Workspace"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}}]} as unknown as DocumentNode<GetMyWorkspacesQuery, GetMyWorkspacesQueryVariables>;
export const GetWorkspaceBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkspaceBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceBySlug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}}]}}]}}]} as unknown as DocumentNode<GetWorkspaceBySlugQuery, GetWorkspaceBySlugQueryVariables>;
export const ArchiveChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ArchiveChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ArchiveChannelMutation, ArchiveChannelMutationVariables>;
export const CheckChannelAvailabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckChannelAvailability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CheckChannelAvailabilityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkChannelAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"reservationId"}}]}}]}}]} as unknown as DocumentNode<CheckChannelAvailabilityMutation, CheckChannelAvailabilityMutationVariables>;
export const CreateChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}}]}}]} as unknown as DocumentNode<CreateChannelMutation, CreateChannelMutationVariables>;
export const CreateDmDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDmInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}}]}}]}}]} as unknown as DocumentNode<CreateDmMutation, CreateDmMutationVariables>;
export const DeleteChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"channelId"}}]}}]}}]} as unknown as DocumentNode<DeleteChannelMutation, DeleteChannelMutationVariables>;
export const GetProjectDmsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectDms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProjectDms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"otherUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unreadCount"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetProjectDmsQuery, GetProjectDmsQueryVariables>;
export const RenameChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenameChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RenameChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<RenameChannelMutation, RenameChannelMutationVariables>;
export const UnarchiveChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnarchiveChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unarchiveChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"channelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"channelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"channelId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UnarchiveChannelMutation, UnarchiveChannelMutationVariables>;
export const CreateWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorkspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;
export const CheckSlugAvailabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckSlugAvailability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkSlugAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CheckSlugAvailabilityMutation, CheckSlugAvailabilityMutationVariables>;
export const InviteToWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InviteToWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteToWorkspaceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inviteToWorkspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"invitedCount"}}]}}]}}]} as unknown as DocumentNode<InviteToWorkspaceMutation, InviteToWorkspaceMutationVariables>;
export const CreateIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIssueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIssue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCardFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<CreateIssueMutation, CreateIssueMutationVariables>;
export const MoveIssueStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MoveIssueStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MoveIssueStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveIssueStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCardFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<MoveIssueStatusMutation, MoveIssueStatusMutationVariables>;
export const ReorderIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReorderIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderIssueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reorderIssue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCardFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<ReorderIssueMutation, ReorderIssueMutationVariables>;
export const GetIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"issueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getIssue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"issueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"issueId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueDetailFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCardFields"}},{"kind":"Field","name":{"kind":"Name","value":"descriptionS3Key"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetIssueQuery, GetIssueQueryVariables>;
export const GetIssueDescriptionUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetIssueDescriptionUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"issueId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getIssueDescriptionUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"issueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"issueId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<GetIssueDescriptionUrlQuery, GetIssueDescriptionUrlQueryVariables>;
export const UpdateIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIssueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIssue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueDetailFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCardFields"}},{"kind":"Field","name":{"kind":"Name","value":"descriptionS3Key"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<UpdateIssueMutation, UpdateIssueMutationVariables>;
export const DeleteIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteIssueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIssue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteIssueMutation, DeleteIssueMutationVariables>;
export const RequestIssueDescriptionUploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestIssueDescriptionUpload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestIssueDescriptionUploadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestIssueDescriptionUpload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"presignedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"descriptionFileId"}}]}}]}}]} as unknown as DocumentNode<RequestIssueDescriptionUploadMutation, RequestIssueDescriptionUploadMutationVariables>;
export const ConfirmIssueDescriptionUploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmIssueDescriptionUpload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConfirmIssueDescriptionUploadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmIssueDescriptionUpload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueDetailFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueDetailFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCardFields"}},{"kind":"Field","name":{"kind":"Name","value":"descriptionS3Key"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ConfirmIssueDescriptionUploadMutation, ConfirmIssueDescriptionUploadMutationVariables>;
export const CreateIssueLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIssueLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIssueLabelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIssueLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueLabelFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueLabelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueLabel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<CreateIssueLabelMutation, CreateIssueLabelMutationVariables>;
export const UpdateIssueLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIssueLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIssueLabelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIssueLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueLabelFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueLabelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueLabel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<UpdateIssueLabelMutation, UpdateIssueLabelMutationVariables>;
export const DeleteIssueLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIssueLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteIssueLabelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIssueLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteIssueLabelMutation, DeleteIssueLabelMutationVariables>;
export const CreateIssueStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateIssueStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIssueStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIssueStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueStatusFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"issueCount"}}]}}]} as unknown as DocumentNode<CreateIssueStatusMutation, CreateIssueStatusMutationVariables>;
export const UpdateIssueStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIssueStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIssueStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIssueStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueStatusFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"issueCount"}}]}}]} as unknown as DocumentNode<UpdateIssueStatusMutation, UpdateIssueStatusMutationVariables>;
export const ReorderIssueStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReorderIssueStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderIssueStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reorderIssueStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueStatusFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"issueCount"}}]}}]} as unknown as DocumentNode<ReorderIssueStatusMutation, ReorderIssueStatusMutationVariables>;
export const DeleteIssueStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIssueStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteIssueStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIssueStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteIssueStatusMutation, DeleteIssueStatusMutationVariables>;
export const AcceptWorkspaceInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptWorkspaceInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AcceptInviteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptWorkspaceInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceSlug"}}]}}]}}]} as unknown as DocumentNode<AcceptWorkspaceInviteMutation, AcceptWorkspaceInviteMutationVariables>;
export const GetWorkspaceInviteInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkspaceInviteInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWorkspaceInviteInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceName"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceLogoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"inviterName"}}]}}]}}]} as unknown as DocumentNode<GetWorkspaceInviteInfoQuery, GetWorkspaceInviteInfoQueryVariables>;
export const SyncUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clerkId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"clerkId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clerkId"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"fullName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}}},{"kind":"Argument","name":{"kind":"Name","value":"avatarUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"avatarUrl"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SyncUserMutation, SyncUserMutationVariables>;
export const CreateOnboardingWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOnboardingWorkspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOnboardingWorkspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<CreateOnboardingWorkspaceMutation, CreateOnboardingWorkspaceMutationVariables>;
export const OnboardingStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OnboardingStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onboardingStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasUser"}},{"kind":"Field","name":{"kind":"Name","value":"hasWorkspace"}},{"kind":"Field","name":{"kind":"Name","value":"hasProject"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceSlug"}}]}}]}}]} as unknown as DocumentNode<OnboardingStatusQuery, OnboardingStatusQueryVariables>;
export const AddPageCollaboratorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddPageCollaborators"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddPageCollaboratorsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addPageCollaborators"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addedCollaborators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddPageCollaboratorsMutation, AddPageCollaboratorsMutationVariables>;
export const CreatePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"coverUrl"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"s3Key"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePageMutation, CreatePageMutationVariables>;
export const DeletePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeletePageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"pageId"}}]}}]}}]} as unknown as DocumentNode<DeletePageMutation, DeletePageMutationVariables>;
export const GetActivePageCollaboratorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActivePageCollaborators"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getActivePageCollaborators"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetActivePageCollaboratorsQuery, GetActivePageCollaboratorsQueryVariables>;
export const GetPageCollaboratorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPageCollaborators"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPageCollaborators"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetPageCollaboratorsQuery, GetPageCollaboratorsQueryVariables>;
export const GetPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"coverUrl"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"s3Key"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetPageQuery, GetPageQueryVariables>;
export const GetProjectPagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProjectPages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageWithChildren"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"coverUrl"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"s3Key"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PageWithChildren"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PageFields"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectPagesQuery, GetProjectPagesQueryVariables>;
export const GetPageSnapshotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPageSnapshot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPageSnapshot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"snapshot"}},{"kind":"Field","name":{"kind":"Name","value":"lastStreamId"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTimestamp"}}]}}]}}]} as unknown as DocumentNode<GetPageSnapshotQuery, GetPageSnapshotQueryVariables>;
export const RemovePageCollaboratorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemovePageCollaborator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemovePageCollaboratorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePageCollaborator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<RemovePageCollaboratorMutation, RemovePageCollaboratorMutationVariables>;
export const RenamePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenamePage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RenamePageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renamePage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<RenamePageMutation, RenamePageMutationVariables>;
export const ReorderPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReorderPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderPageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reorderPage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<ReorderPageMutation, ReorderPageMutationVariables>;
export const ArchivePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchivePage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ArchivePageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archivePage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<ArchivePageMutation, ArchivePageMutationVariables>;
export const UnarchivePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnarchivePage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnarchivePageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unarchivePage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<UnarchivePageMutation, UnarchivePageMutationVariables>;
export const LockPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LockPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LockPageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lockPage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<LockPageMutation, LockPageMutationVariables>;
export const UnlockPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnlockPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnlockPageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlockPage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<UnlockPageMutation, UnlockPageMutationVariables>;
export const CreateProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProjectInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"activePlugins"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<CreateProjectMutation, CreateProjectMutationVariables>;
export const CheckSlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckSlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkProjectSlugAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"reservationId"}}]}}]}}]} as unknown as DocumentNode<CheckSlugMutation, CheckSlugMutationVariables>;
export const CreateVaultFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVaultFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVaultFolderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVaultFolder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VaultFolderFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFolderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateVaultFolderMutation, CreateVaultFolderMutationVariables>;
export const DeleteVaultFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteVaultFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteVaultFileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteVaultFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteVaultFileMutation, DeleteVaultFileMutationVariables>;
export const DeleteVaultFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteVaultFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteVaultFolderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteVaultFolder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteVaultFolderMutation, DeleteVaultFolderMutationVariables>;
export const GetVaultAncestorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVaultAncestors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVaultAncestors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"folderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VaultFolderFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFolderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetVaultAncestorsQuery, GetVaultAncestorsQueryVariables>;
export const GetVaultChildrenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVaultChildren"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentFolderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"VaultSortField"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDir"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVaultChildren"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"parentFolderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentFolderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDir"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDir"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VaultFolderFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VaultFileFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalFileCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFolderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"uploaderUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"sizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"s3Key"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetVaultChildrenQuery, GetVaultChildrenQueryVariables>;
export const GetVaultDownloadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVaultDownloadUrl"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVaultDownloadUrl"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<GetVaultDownloadUrlQuery, GetVaultDownloadUrlQueryVariables>;
export const GetVaultNodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVaultNode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VaultNodeType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVaultNode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VaultFolderFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VaultFileFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFolderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"uploaderUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"sizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"s3Key"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetVaultNodeQuery, GetVaultNodeQueryVariables>;
export const GetVaultSidebarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVaultSidebar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVaultSidebar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pinnedFolders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VaultFolderFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"systemFolders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VaultFolderFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFolderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GetVaultSidebarQuery, GetVaultSidebarQueryVariables>;
export const GetVaultUsageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVaultUsage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVaultUsage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectUsedBytes"}},{"kind":"Field","name":{"kind":"Name","value":"projectLimitBytes"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceUsedBytes"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceLimitBytes"}},{"kind":"Field","name":{"kind":"Name","value":"projectFileCount"}},{"kind":"Field","name":{"kind":"Name","value":"projectFileCountLimit"}}]}}]}}]} as unknown as DocumentNode<GetVaultUsageQuery, GetVaultUsageQueryVariables>;
export const MoveVaultFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MoveVaultFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MoveVaultFileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveVaultFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VaultFileFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"uploaderUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"sizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"s3Key"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<MoveVaultFileMutation, MoveVaultFileMutationVariables>;
export const MoveVaultFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MoveVaultFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MoveVaultFolderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveVaultFolder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VaultFolderFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFolderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<MoveVaultFolderMutation, MoveVaultFolderMutationVariables>;
export const PinVaultFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PinVaultFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PinVaultFolderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pinVaultFolder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VaultFolderFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFolderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<PinVaultFolderMutation, PinVaultFolderMutationVariables>;
export const RenameVaultFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenameVaultFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RenameVaultFileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameVaultFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VaultFileFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFileFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"uploaderUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"sizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"s3Key"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RenameVaultFileMutation, RenameVaultFileMutationVariables>;
export const RenameVaultFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenameVaultFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RenameVaultFolderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameVaultFolder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VaultFolderFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VaultFolderFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VaultFolder"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"parentFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<RenameVaultFolderMutation, RenameVaultFolderMutationVariables>;
export const UnpinVaultFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnpinVaultFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnpinVaultFolderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unpinVaultFolder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UnpinVaultFolderMutation, UnpinVaultFolderMutationVariables>;
export const RequestVaultUploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestVaultUpload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestVaultUploadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestVaultUpload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileId"}},{"kind":"Field","name":{"kind":"Name","value":"presignedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<RequestVaultUploadMutation, RequestVaultUploadMutationVariables>;
export const ConfirmVaultUploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmVaultUpload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConfirmVaultUploadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmVaultUpload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"sizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"uploader"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<ConfirmVaultUploadMutation, ConfirmVaultUploadMutationVariables>;
export const GetWorkspaceMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkspaceMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaceMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetWorkspaceMembersQuery, GetWorkspaceMembersQueryVariables>;
export const UpdateWorkspaceMemberRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWorkspaceMemberRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWorkspaceMemberRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<UpdateWorkspaceMemberRoleMutation, UpdateWorkspaceMemberRoleMutationVariables>;
export const RemoveWorkspaceMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveWorkspaceMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeWorkspaceMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<RemoveWorkspaceMemberMutation, RemoveWorkspaceMemberMutationVariables>;
export const AddBoardCollaboratorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddBoardCollaborators"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addBoardCollaborators"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"addedCount"}},{"kind":"Field","name":{"kind":"Name","value":"skippedCount"}}]}}]}}]} as unknown as DocumentNode<AddBoardCollaboratorsMutation, AddBoardCollaboratorsMutationVariables>;
export const GetBoardCollaboratorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBoardCollaborators"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardCollaborators"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetBoardCollaboratorsQuery, GetBoardCollaboratorsQueryVariables>;
export const ArchiveBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ArchiveBoardMutation, ArchiveBoardMutationVariables>;
export const CreateBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBoardInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addedCollaborators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}}]}}]}}]}}]} as unknown as DocumentNode<CreateBoardMutation, CreateBoardMutationVariables>;
export const DeleteBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"boardId"}}]}}]}}]} as unknown as DocumentNode<DeleteBoardMutation, DeleteBoardMutationVariables>;
export const GetBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}}]}}]}}]} as unknown as DocumentNode<GetBoardQuery, GetBoardQueryVariables>;
export const GetActiveCollaboratorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveCollaborators"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeCollaborators"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"connectionId"}},{"kind":"Field","name":{"kind":"Name","value":"joinedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenAt"}},{"kind":"Field","name":{"kind":"Name","value":"cursorPosition"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}}]}}]} as unknown as DocumentNode<GetActiveCollaboratorsQuery, GetActiveCollaboratorsQueryVariables>;
export const GetBoardSnapshotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBoardSnapshot"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientSnapshot"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBoardSnapshot"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"clientSnapshot"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientSnapshot"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardId"}},{"kind":"Field","name":{"kind":"Name","value":"snapshot"}},{"kind":"Field","name":{"kind":"Name","value":"lastStreamId"}},{"kind":"Field","name":{"kind":"Name","value":"snapshotTimestamp"}}]}}]}}]} as unknown as DocumentNode<GetBoardSnapshotQuery, GetBoardSnapshotQueryVariables>;
export const GetUserBoardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserBoards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userBoards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"elementCount"}},{"kind":"Field","name":{"kind":"Name","value":"fileSizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<GetUserBoardsQuery, GetUserBoardsQueryVariables>;
export const LockBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LockBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lockBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<LockBoardMutation, LockBoardMutationVariables>;
export const RemoveBoardCollaboratorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveBoardCollaborator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeBoardCollaborator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<RemoveBoardCollaboratorMutation, RemoveBoardCollaboratorMutationVariables>;
export const RenameBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RenameBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<RenameBoardMutation, RenameBoardMutationVariables>;
export const UnarchiveBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnarchiveBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unarchiveBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UnarchiveBoardMutation, UnarchiveBoardMutationVariables>;
export const UnlockBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnlockBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlockBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UnlockBoardMutation, UnlockBoardMutationVariables>;
export const UpdateBoardDescriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBoardDescription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardDescription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateBoardDescriptionMutation, UpdateBoardDescriptionMutationVariables>;
export const RegisterExternalFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterExternalFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterExternalFileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerExternalFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileId"}},{"kind":"Field","name":{"kind":"Name","value":"presignedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<RegisterExternalFileMutation, RegisterExternalFileMutationVariables>;
export const ConfirmVaultUploadExternalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmVaultUploadExternal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConfirmVaultUploadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmVaultUpload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"sizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<ConfirmVaultUploadExternalMutation, ConfirmVaultUploadExternalMutationVariables>;
export const GetBatchDownloadUrlsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBatchDownloadUrls"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBatchDownloadUrls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fileId"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"sizeBytes"}}]}}]}}]} as unknown as DocumentNode<GetBatchDownloadUrlsQuery, GetBatchDownloadUrlsQueryVariables>;
export const MarkFilesUnreferencedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkFilesUnreferenced"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MarkFilesUnreferencedInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markFilesUnreferenced"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markedCount"}}]}}]}}]} as unknown as DocumentNode<MarkFilesUnreferencedMutation, MarkFilesUnreferencedMutationVariables>;
export const GetVaultUsageSharedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVaultUsageShared"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVaultUsage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectUsedBytes"}},{"kind":"Field","name":{"kind":"Name","value":"projectReservedBytes"}},{"kind":"Field","name":{"kind":"Name","value":"projectLimitBytes"}},{"kind":"Field","name":{"kind":"Name","value":"projectFileCount"}},{"kind":"Field","name":{"kind":"Name","value":"projectFileCountLimit"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceUsedBytes"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceReservedBytes"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceLimitBytes"}},{"kind":"Field","name":{"kind":"Name","value":"percentUsed"}}]}}]}}]} as unknown as DocumentNode<GetVaultUsageSharedQuery, GetVaultUsageSharedQueryVariables>;
export const GetActiveContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveContext"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeContext"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceRole"}},{"kind":"Field","name":{"kind":"Name","value":"projectRole"}},{"kind":"Field","name":{"kind":"Name","value":"grantedPermissions"}},{"kind":"Field","name":{"kind":"Name","value":"featureFlags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]}}]} as unknown as DocumentNode<GetActiveContextQuery, GetActiveContextQueryVariables>;
export const GetProjectIssuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectIssues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProjectIssues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueCardFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueCardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<GetProjectIssuesQuery, GetProjectIssuesQueryVariables>;
export const GetIssueStatusesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetIssueStatuses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getIssueStatuses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueStatusFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueStatusFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueStatus"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"isSystem"}},{"kind":"Field","name":{"kind":"Name","value":"issueCount"}}]}}]} as unknown as DocumentNode<GetIssueStatusesQuery, GetIssueStatusesQueryVariables>;
export const GetIssueLabelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetIssueLabels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getIssueLabels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueLabelFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueLabelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueLabel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"projectId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GetIssueLabelsQuery, GetIssueLabelsQueryVariables>;