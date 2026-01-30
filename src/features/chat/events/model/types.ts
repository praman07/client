/**
 * CHAT EVENTS MODEL: Type definitions for chat event handlers
 */

export interface ChatEventHandlerContext {
  /**
   * Returns current project ID for workspace-scoped operations
   */
  getProjectId: () => string | undefined
}
