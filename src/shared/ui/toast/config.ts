/**
 * Toast Configuration Registry
 * 
 * Central registry for all toast notification types.
 * Add new toast types by calling registerToastConfig.
 */

import { registerToastConfig } from './types'
import type { ChatMessageNewPayload, ChatMessageMentionPayload, ChatMessageReplyPayload } from '@/shared/contracts/notification/downstream'
import { enrichChatMessageNew, enrichChatMention, enrichChatReply } from './enricher'

// ─────────────────────────────────────────────────────────────────────────────
// Chat Notifications
// ─────────────────────────────────────────────────────────────────────────────

registerToastConfig('chat.message.new', {
  variant: 'default',
  duration: 5000,
  enricher: (payload: unknown) => {
    return enrichChatMessageNew(payload as ChatMessageNewPayload)
  },
})

registerToastConfig('chat.message.mention', {
  variant: 'mention',
  duration: 7000,
  enricher: (payload: unknown) => {
    return enrichChatMention(payload as ChatMessageMentionPayload)
  },
})

registerToastConfig('chat.message.reply', {
  variant: 'reply',
  duration: 6000,
  enricher: (payload: unknown) => {
    return enrichChatReply(payload as ChatMessageReplyPayload)
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// Issue Notifications (Example - add more as needed)
// ─────────────────────────────────────────────────────────────────────────────

// registerToastConfig('issue.assigned', {
//   variant: 'default',
//   duration: 6000,
//   enricher: (payload: unknown) => {
//     return enrichIssueAssigned(payload as IssueAssignedPayload)
//   },
// })

// registerToastConfig('issue.status_changed', {
//   variant: 'default',
//   duration: 5000,
//   enricher: (payload: unknown) => {
//     return enrichIssueStatusChanged(payload as IssueStatusChangedPayload)
//   },
// })

// ─────────────────────────────────────────────────────────────────────────────
// System Notifications (Example)
// ─────────────────────────────────────────────────────────────────────────────

// registerToastConfig('system.plan_limit', {
//   variant: 'warning',
//   duration: 10000,
//   enricher: (payload: unknown) => {
//     return enrichSystemAlert(payload as SystemPlanLimitPayload)
//   },
// })

// registerToastConfig('workspace.invite.accepted', {
//   variant: 'success',
//   duration: 5000,
//   enricher: (payload: unknown) => {
//     return enrichWorkspaceInviteAccepted(payload as WorkspaceInviteAcceptedPayload)
//   },
// })

export { registerToastConfig }
export { getToastConfig } from './types'
