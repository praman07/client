/**
 * Notification Event Names — Single Source of Truth
 * Mirrors ChatDownstreamEvent pattern from chat/events.ts
 */

export enum NotificationDownstreamEvent {
  // Chat notifications
  ChatChannelMemberAdded = 'chat.channel.member.added',
  ChatChannelMemberRemoved = 'chat.channel.member.removed',
  ChatDmCreated = 'chat.dm.created',
  ChatGroupMemberAdded = 'chat.group.member.added',
  ChatMessageMention = 'chat.message.mention',
  ChatMessageNew = 'chat.message.new',
  ChatMessageReply = 'chat.message.reply',
  ChatReactionAdded = 'chat.reaction.added',
  ChatThreadCreated = 'chat.thread.created',
  ChatThreadReply = 'chat.thread.reply',

  // Issue notifications
  IssueAssigned = 'issue.assigned',
  IssueCreated = 'issue.created',
  IssueDeleted = 'issue.deleted',
  IssueDueDateApproaching = 'issue.due_date.approaching',
  IssueMention = 'issue.mention',
  IssueOverdue = 'issue.overdue',
  IssuePriorityChanged = 'issue.priority.changed',
  IssueStatusChanged = 'issue.status.changed',
  IssueUnassigned = 'issue.unassigned',

  // Page notifications
  PageArchived = 'page.archived',
  PageCollaboratorAdded = 'page.collaborator.added',
  PageCollaboratorRemoved = 'page.collaborator.removed',
  PageDeleted = 'page.deleted',
  PageLocked = 'page.locked',
  PageMention = 'page.mention',

  // Project notifications
  ProjectArchived = 'project.archived',
  ProjectMemberAdded = 'project.member.added',
  ProjectMemberRemoved = 'project.member.removed',
  ProjectMemberRoleChanged = 'project.member.role_changed',
  ProjectUnarchived = 'project.unarchived',

  // Whiteboard notifications
  WhiteboardArchived = 'whiteboard.archived',
  WhiteboardCollaboratorAdded = 'whiteboard.collaborator.added',
  WhiteboardCollaboratorRemoved = 'whiteboard.collaborator.removed',
  WhiteboardLocked = 'whiteboard.locked',

  // Workspace notifications
  WorkspaceInviteAccepted = 'workspace.invite.accepted',
  WorkspaceInviteResent = 'workspace.invite.resent',
  WorkspaceInviteSent = 'workspace.invite.sent',
  WorkspaceMemberJoined = 'workspace.member.joined',
  WorkspaceMemberRemoved = 'workspace.member.removed',
  WorkspaceMemberRoleChanged = 'workspace.member.role_changed',
  WorkspaceOwnershipTransferred = 'workspace.ownership.transferred',

  // System notifications
  SystemPlanLimit = 'system.plan.limit',
  SystemSubscriptionExpiring = 'system.subscription.expiring',
  UserWelcome = 'user.welcome',
  VaultStorageLimit = 'vault.storage.limit',
}
