/**
 * CHAT EVENTS MODEL: Type definitions for chat event handlers
 */

export interface ChatEventHandlerContext {
  /**
   * Returns current project ID for workspace-scoped operations
   */
  getProjectId: () => string | undefined
  /**
   * Returns the authenticated current user's ID.
   * Needed by reaction handlers to set the hasReacted flag correctly.
   */
  getCurrentUserId: () => string
}
