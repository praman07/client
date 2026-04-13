/**
 * Notification Event Handler Context
 * Dependencies required by notification event handlers
 */

import type { AppDispatch } from '@/app/store'

export interface NotificationEventHandlerContext {
  dispatch: AppDispatch
  getCurrentUserId: () => string | null
  getCurrentWorkspaceSlug: () => string | null
}
