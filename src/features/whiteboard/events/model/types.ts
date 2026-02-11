/**
 * Whiteboard Event Handler Context
 *
 * Architecture: Context pattern for event handlers to access app state
 * Pattern: Matches chat domain event handler context
 */

import type { AppDispatch } from '@/app/store'
import type { QueryClient } from '@tanstack/react-query'

export interface WhiteboardEventHandlerContext {
  dispatch: AppDispatch
  queryClient: QueryClient
  userId: string | null // Current authenticated user
}
