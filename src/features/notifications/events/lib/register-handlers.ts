/**
 * REGISTER HANDLERS: Notification event handler registration
 *
 * Responsibility:
 * - Register all notification event handlers with event bus
 * - Wire up handler context dependencies
 * - Return cleanup function for unmounting
 */

import {
  registerChatDmCreatedHandler,
  registerChatGroupMemberAddedHandler,
  registerChatMessageMentionHandler,
  registerChatMessageNewHandler,
  registerChatMessageReplyHandler,
  registerChatReactionAddedHandler,
  registerChatThreadCreatedHandler,
  registerChatThreadReplyHandler,
} from './handlers/chat'

import {
  registerIssueAssignedHandler,
  registerIssueCreatedHandler,
  registerIssueDeletedHandler,
  registerIssueMentionHandler,
  registerIssuePriorityChangedHandler,
  registerIssueStatusChangedHandler,
  registerIssueUnassignedHandler,
} from './handlers/issues'

import {
  registerPageArchivedHandler,
  registerPageCollaboratorAddedHandler,
  registerPageCollaboratorRemovedHandler,
  registerPageDeletedHandler,
  registerPageLockedHandler,
  registerPageMentionHandler,
  registerProjectArchivedHandler,
  registerProjectMemberAddedHandler,
  registerProjectMemberRemovedHandler,
  registerProjectMemberRoleChangedHandler,
  registerProjectUnarchivedHandler,
  registerWhiteboardArchivedHandler,
  registerWhiteboardCollaboratorAddedHandler,
  registerWhiteboardCollaboratorRemovedHandler,
  registerWhiteboardLockedHandler,
} from './handlers/collab'

import {
  registerSystemPlanLimitHandler,
  registerSystemSubscriptionExpiringHandler,
  registerUserWelcomeHandler,
  registerVaultStorageLimitHandler,
  registerWorkspaceInviteAcceptedHandler,
  registerWorkspaceInviteResentHandler,
  registerWorkspaceInviteSentHandler,
  registerWorkspaceMemberJoinedHandler,
  registerWorkspaceMemberRemovedHandler,
  registerWorkspaceMemberRoleChangedHandler,
  registerWorkspaceOwnershipTransferredHandler,
} from './handlers/workspace'
import type { NotificationEventHandlerContext } from '../model/types'

export function registerNotificationHandlers(context: NotificationEventHandlerContext) {
  const cleanups = [
    registerChatMessageNewHandler(context),
    registerChatMessageMentionHandler(context),
    registerChatDmCreatedHandler(context),
    registerChatGroupMemberAddedHandler(context),
    registerChatThreadCreatedHandler(context),
    registerChatThreadReplyHandler(context),
    registerChatMessageReplyHandler(context),
    registerChatReactionAddedHandler(context),
    registerIssueAssignedHandler(context),
    registerIssueCreatedHandler(context),
    registerIssueDeletedHandler(context),
    registerIssueMentionHandler(context),
    registerIssueStatusChangedHandler(context),
    registerIssuePriorityChangedHandler(context),
    registerIssueUnassignedHandler(context),
    registerPageCollaboratorAddedHandler(context),
    registerPageCollaboratorRemovedHandler(context),
    registerPageArchivedHandler(context),
    registerPageDeletedHandler(context),
    registerPageLockedHandler(context),
    registerPageMentionHandler(context),
    registerProjectArchivedHandler(context),
    registerProjectUnarchivedHandler(context),
    registerProjectMemberAddedHandler(context),
    registerProjectMemberRemovedHandler(context),
    registerProjectMemberRoleChangedHandler(context),
    registerWhiteboardArchivedHandler(context),
    registerWhiteboardCollaboratorAddedHandler(context),
    registerWhiteboardCollaboratorRemovedHandler(context),
    registerWhiteboardLockedHandler(context),
    registerWorkspaceInviteSentHandler(context),
    registerWorkspaceInviteAcceptedHandler(context),
    registerWorkspaceInviteResentHandler(context),
    registerWorkspaceMemberJoinedHandler(context),
    registerWorkspaceMemberRemovedHandler(context),
    registerWorkspaceMemberRoleChangedHandler(context),
    registerWorkspaceOwnershipTransferredHandler(context),
    registerSystemPlanLimitHandler(context),
    registerSystemSubscriptionExpiringHandler(context),
    registerUserWelcomeHandler(context),
    registerVaultStorageLimitHandler(context),
  ]

  return () => {
    cleanups.forEach((fn) => fn())
  }
}
