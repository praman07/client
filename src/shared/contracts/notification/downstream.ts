/**
 * DOWNSTREAM CONTRACTS (Server -> Client)
 * Domain: Notification
 * All server-sent WebSocket notification events
 */

import type { NotificationDownstreamEvent } from './events'
import type { DownstreamContract } from '../types'

// ═══════════════════════════════════════════════════════════════
// PAYLOADS — Derived from backend Zod schemas
// ═══════════════════════════════════════════════════════════════

export interface ChatMessageMentionPayload {
  messageId: string
  conversationId: string
  conversationName: string | null
  workspaceId: string
  workspaceSlug: string
  mentionedUserId: string
  actorId: string
  actorName: string
  contentPreview: string
}

export interface ChatDmCreatedPayload {
  conversationId: string
  workspaceId: string
  actorId: string
  actorName: string
  participantIds: Array<string>
}

export interface ChatGroupMemberAddedPayload {
  conversationId: string
  workspaceId: string
  actorId: string
  actorName: string
  addedUserId: string
  addedUserName: string
}

export interface ChatThreadCreatedPayload {
  threadId: string
  parentMessageId: string
  conversationId: string
  workspaceId: string
  actorId: string
  actorName: string
}

export interface ChatThreadReplyPayload {
  threadId: string
  parentMessageId: string
  conversationId: string
  workspaceId: string
  actorId: string
  actorName: string
}

export interface ChatMessageReplyPayload {
  messageId: string
  parentMessageId: string
  conversationId: string
  workspaceId: string
  actorId: string
  actorName: string
}

export interface ChatReactionAddedPayload {
  messageId: string
  conversationId: string
  workspaceId: string
  actorId: string
  actorName: string
  emoji: string
}

export interface IssueAssignedPayload {
  issueId: string
  issueTitle: string
  issueNumber: number
  projectId: string
  projectName: string
  workspaceSlug: string
  assigneeId: string
  actorId: string
  actorName: string
}

export interface IssueCreatedPayload {
  issueId: string
  issueTitle: string
  issueNumber: number
  projectId: string
  projectName: string
  workspaceSlug: string
  actorId: string
  actorName: string
}

export interface IssueDeletedPayload {
  issueId: string
  projectId: string
  workspaceSlug: string
  actorId: string
  actorName: string
}

export interface IssueMentionPayload {
  issueId: string
  issueTitle: string
  issueNumber: number
  projectId: string
  projectName: string
  workspaceSlug: string
  mentionedUserId: string
  actorId: string
  actorName: string
}

export interface IssueStatusChangedPayload {
  issueId: string
  issueTitle: string
  issueNumber: number
  projectId: string
  projectName: string
  workspaceSlug: string
  actorId: string
  actorName: string
  oldStatus: string
  newStatus: string
}

export interface IssuePriorityChangedPayload {
  issueId: string
  issueTitle: string
  issueNumber: number
  projectId: string
  projectName: string
  workspaceSlug: string
  actorId: string
  actorName: string
  oldPriority: string
  newPriority: string
}

export interface IssueUnassignedPayload {
  issueId: string
  issueTitle: string
  issueNumber: number
  projectId: string
  projectName: string
  workspaceSlug: string
  previousAssigneeId: string
  actorId: string
  actorName: string
}

export interface PageCollaboratorAddedPayload {
  pageId: string
  pageTitle: string
  projectId: string
  workspaceId: string
  actorId: string
  actorName: string
  addedUserId: string
  addedUserName: string
}

export interface PageCollaboratorRemovedPayload {
  pageId: string
  pageTitle: string
  projectId: string
  workspaceId: string
  actorId: string
  actorName: string
  removedUserId: string
  removedUserName: string
}

export interface PageArchivedPayload {
  pageId: string
  pageTitle: string
  projectId: string
  workspaceId: string
  actorId: string
  actorName: string
}

export interface PageDeletedPayload {
  pageId: string
  pageTitle: string
  projectId: string
  workspaceId: string
  actorId: string
  actorName: string
}

export interface PageLockedPayload {
  pageId: string
  pageTitle: string
  projectId: string
  workspaceId: string
  actorId: string
  actorName: string
}

export interface PageMentionPayload {
  pageId: string
  pageTitle: string
  projectId: string
  workspaceId: string
  mentionedUserId: string
  actorId: string
  actorName: string
  contentPreview: string
}

export interface ProjectArchivedPayload {
  projectId: string
  projectName: string
  workspaceId: string
  workspaceSlug: string
  memberIds: Array<string>
  actorId: string
  actorName: string
}

export interface ProjectUnarchivedPayload {
  projectId: string
  projectName: string
  workspaceId: string
  workspaceSlug: string
  memberIds: Array<string>
  actorId: string
  actorName: string
}

export interface ProjectMemberAddedPayload {
  projectId: string
  projectName: string
  workspaceId: string
  workspaceSlug: string
  addedUserId: string
  addedUserName: string
  roleName: string
  actorId: string
  actorName: string
}

export interface ProjectMemberRemovedPayload {
  projectId: string
  projectName: string
  workspaceId: string
  workspaceSlug: string
  removedUserId: string
  removedUserName: string
  actorId: string
  actorName: string
}

export interface ProjectMemberRoleChangedPayload {
  projectId: string
  projectName: string
  workspaceId: string
  workspaceSlug: string
  userId: string
  userName: string
  oldRole: string
  newRole: string
  actorId: string
  actorName: string
}

export interface WhiteboardArchivedPayload {
  boardId: string
  boardTitle: string
  projectId: string
  workspaceId: string
  actorId: string
  actorName: string
}

export interface WhiteboardCollaboratorAddedPayload {
  boardId: string
  boardTitle: string
  projectId: string
  workspaceId: string
  actorId: string
  actorName: string
  addedUserId: string
  addedUserName: string
}

export interface WhiteboardCollaboratorRemovedPayload {
  boardId: string
  boardTitle: string
  projectId: string
  workspaceId: string
  actorId: string
  actorName: string
  removedUserId: string
  removedUserName: string
}

export interface WhiteboardLockedPayload {
  boardId: string
  boardTitle: string
  projectId: string
  workspaceId: string
  actorId: string
  actorName: string
}

export interface WorkspaceInviteSentPayload {
  workspaceId: string
  workspaceName: string
  workspaceSlug: string
  inviteToken: string
  inviteId: string
  inviteeEmail: string
  inviteeUserId: string | null
  actorId: string
  actorName: string
  roleName: string
}

export interface WorkspaceInviteAcceptedPayload {
  workspaceId: string
  workspaceName: string
  workspaceSlug: string
  newMemberId: string
  newMemberName: string
  actorId: string
  actorName: string
}

export interface WorkspaceInviteResentPayload {
  workspaceId: string
  workspaceName: string
  workspaceSlug: string
  inviteId: string
  inviteeEmail: string
  actorId: string
  actorName: string
}

export interface WorkspaceMemberJoinedPayload {
  workspaceId: string
  workspaceName: string
  workspaceSlug: string
  newMemberId: string
  newMemberName: string
}

export interface WorkspaceMemberRemovedPayload {
  workspaceId: string
  workspaceName: string
  workspaceSlug: string
  removedUserId: string
  removedUserName: string
  actorId: string
  actorName: string
}

export interface WorkspaceMemberRoleChangedPayload {
  workspaceId: string
  workspaceName: string
  workspaceSlug: string
  userId: string
  userName: string
  oldRole: string
  newRole: string
  actorId: string
  actorName: string
}

export interface WorkspaceOwnershipTransferredPayload {
  workspaceId: string
  workspaceName: string
  workspaceSlug: string
  previousOwnerId: string
  previousOwnerName: string
  newOwnerId: string
  newOwnerName: string
  actorId: string
  actorName: string
}

export interface SystemPlanLimitPayload {
  workspaceId: string
  workspaceName: string
  currentUsage: number
  limit: number
  metric: string
}

export interface SystemSubscriptionExpiringPayload {
  workspaceId: string
  workspaceName: string
  expiresAt: string
  daysRemaining: number
}

export interface UserWelcomePayload {
  userId: string
  userName: string
  workspaceId: string
  workspaceName: string
}

export interface VaultStorageLimitPayload {
  workspaceId: string
  workspaceName: string
  currentUsage: number
  limit: number
}

// ═══════════════════════════════════════════════════════════════
// CONTRACT TYPES — Discriminated unions for type-safe handling
// ═══════════════════════════════════════════════════════════════

export type ChatMessageMentionContract = DownstreamContract<NotificationDownstreamEvent.ChatMessageMention, ChatMessageMentionPayload>
export type ChatDmCreatedContract = DownstreamContract<NotificationDownstreamEvent.ChatDmCreated, ChatDmCreatedPayload>
export type ChatGroupMemberAddedContract = DownstreamContract<NotificationDownstreamEvent.ChatGroupMemberAdded, ChatGroupMemberAddedPayload>
export type ChatThreadCreatedContract = DownstreamContract<NotificationDownstreamEvent.ChatThreadCreated, ChatThreadCreatedPayload>
export type ChatThreadReplyContract = DownstreamContract<NotificationDownstreamEvent.ChatThreadReply, ChatThreadReplyPayload>
export type ChatMessageReplyContract = DownstreamContract<NotificationDownstreamEvent.ChatMessageReply, ChatMessageReplyPayload>
export type ChatReactionAddedContract = DownstreamContract<NotificationDownstreamEvent.ChatReactionAdded, ChatReactionAddedPayload>

export type IssueAssignedContract = DownstreamContract<NotificationDownstreamEvent.IssueAssigned, IssueAssignedPayload>
export type IssueCreatedContract = DownstreamContract<NotificationDownstreamEvent.IssueCreated, IssueCreatedPayload>
export type IssueDeletedContract = DownstreamContract<NotificationDownstreamEvent.IssueDeleted, IssueDeletedPayload>
export type IssueMentionContract = DownstreamContract<NotificationDownstreamEvent.IssueMention, IssueMentionPayload>
export type IssueStatusChangedContract = DownstreamContract<NotificationDownstreamEvent.IssueStatusChanged, IssueStatusChangedPayload>
export type IssuePriorityChangedContract = DownstreamContract<NotificationDownstreamEvent.IssuePriorityChanged, IssuePriorityChangedPayload>
export type IssueUnassignedContract = DownstreamContract<NotificationDownstreamEvent.IssueUnassigned, IssueUnassignedPayload>

export type PageCollaboratorAddedContract = DownstreamContract<NotificationDownstreamEvent.PageCollaboratorAdded, PageCollaboratorAddedPayload>
export type PageCollaboratorRemovedContract = DownstreamContract<NotificationDownstreamEvent.PageCollaboratorRemoved, PageCollaboratorRemovedPayload>
export type PageArchivedContract = DownstreamContract<NotificationDownstreamEvent.PageArchived, PageArchivedPayload>
export type PageDeletedContract = DownstreamContract<NotificationDownstreamEvent.PageDeleted, PageDeletedPayload>
export type PageLockedContract = DownstreamContract<NotificationDownstreamEvent.PageLocked, PageLockedPayload>
export type PageMentionContract = DownstreamContract<NotificationDownstreamEvent.PageMention, PageMentionPayload>

export type ProjectArchivedContract = DownstreamContract<NotificationDownstreamEvent.ProjectArchived, ProjectArchivedPayload>
export type ProjectUnarchivedContract = DownstreamContract<NotificationDownstreamEvent.ProjectUnarchived, ProjectUnarchivedPayload>
export type ProjectMemberAddedContract = DownstreamContract<NotificationDownstreamEvent.ProjectMemberAdded, ProjectMemberAddedPayload>
export type ProjectMemberRemovedContract = DownstreamContract<NotificationDownstreamEvent.ProjectMemberRemoved, ProjectMemberRemovedPayload>
export type ProjectMemberRoleChangedContract = DownstreamContract<NotificationDownstreamEvent.ProjectMemberRoleChanged, ProjectMemberRoleChangedPayload>

export type WhiteboardArchivedContract = DownstreamContract<NotificationDownstreamEvent.WhiteboardArchived, WhiteboardArchivedPayload>
export type WhiteboardCollaboratorAddedContract = DownstreamContract<NotificationDownstreamEvent.WhiteboardCollaboratorAdded, WhiteboardCollaboratorAddedPayload>
export type WhiteboardCollaboratorRemovedContract = DownstreamContract<NotificationDownstreamEvent.WhiteboardCollaboratorRemoved, WhiteboardCollaboratorRemovedPayload>
export type WhiteboardLockedContract = DownstreamContract<NotificationDownstreamEvent.WhiteboardLocked, WhiteboardLockedPayload>

export type WorkspaceInviteSentContract = DownstreamContract<NotificationDownstreamEvent.WorkspaceInviteSent, WorkspaceInviteSentPayload>
export type WorkspaceInviteAcceptedContract = DownstreamContract<NotificationDownstreamEvent.WorkspaceInviteAccepted, WorkspaceInviteAcceptedPayload>
export type WorkspaceInviteResentContract = DownstreamContract<NotificationDownstreamEvent.WorkspaceInviteResent, WorkspaceInviteResentPayload>
export type WorkspaceMemberJoinedContract = DownstreamContract<NotificationDownstreamEvent.WorkspaceMemberJoined, WorkspaceMemberJoinedPayload>
export type WorkspaceMemberRemovedContract = DownstreamContract<NotificationDownstreamEvent.WorkspaceMemberRemoved, WorkspaceMemberRemovedPayload>
export type WorkspaceMemberRoleChangedContract = DownstreamContract<NotificationDownstreamEvent.WorkspaceMemberRoleChanged, WorkspaceMemberRoleChangedPayload>
export type WorkspaceOwnershipTransferredContract = DownstreamContract<NotificationDownstreamEvent.WorkspaceOwnershipTransferred, WorkspaceOwnershipTransferredPayload>

export type SystemPlanLimitContract = DownstreamContract<NotificationDownstreamEvent.SystemPlanLimit, SystemPlanLimitPayload>
export type SystemSubscriptionExpiringContract = DownstreamContract<NotificationDownstreamEvent.SystemSubscriptionExpiring, SystemSubscriptionExpiringPayload>
export type UserWelcomeContract = DownstreamContract<NotificationDownstreamEvent.UserWelcome, UserWelcomePayload>
export type VaultStorageLimitContract = DownstreamContract<NotificationDownstreamEvent.VaultStorageLimit, VaultStorageLimitPayload>

// ═══════════════════════════════════════════════════════════════
// UNION TYPE — All notification contracts
// ═══════════════════════════════════════════════════════════════

export type NotificationDownstreamContract =
  | ChatMessageMentionContract
  | ChatDmCreatedContract
  | ChatGroupMemberAddedContract
  | ChatThreadCreatedContract
  | ChatThreadReplyContract
  | ChatMessageReplyContract
  | ChatReactionAddedContract
  | IssueAssignedContract
  | IssueCreatedContract
  | IssueDeletedContract
  | IssueMentionContract
  | IssueStatusChangedContract
  | IssuePriorityChangedContract
  | IssueUnassignedContract
  | PageCollaboratorAddedContract
  | PageCollaboratorRemovedContract
  | PageArchivedContract
  | PageDeletedContract
  | PageLockedContract
  | PageMentionContract
  | ProjectArchivedContract
  | ProjectUnarchivedContract
  | ProjectMemberAddedContract
  | ProjectMemberRemovedContract
  | ProjectMemberRoleChangedContract
  | WhiteboardArchivedContract
  | WhiteboardCollaboratorAddedContract
  | WhiteboardCollaboratorRemovedContract
  | WhiteboardLockedContract
  | WorkspaceInviteSentContract
  | WorkspaceInviteAcceptedContract
  | WorkspaceInviteResentContract
  | WorkspaceMemberJoinedContract
  | WorkspaceMemberRemovedContract
  | WorkspaceMemberRoleChangedContract
  | WorkspaceOwnershipTransferredContract
  | SystemPlanLimitContract
  | SystemSubscriptionExpiringContract
  | UserWelcomeContract
  | VaultStorageLimitContract

export type NotificationEvent = NotificationDownstreamContract
