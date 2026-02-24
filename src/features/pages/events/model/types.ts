import type { AppDispatch } from '@/app/store'
import type { QueryClient } from '@tanstack/react-query'

/**
 * Shared context injected into all page WS event handlers.
 * Mirrors WhiteboardEventHandlerContext from features/whiteboard/events.
 *
 * Note: PageAwarenessProvider is NOT here — it is per-page, mounted by the
 * widget, and stored in a module-level map accessed by awareness-update.ts.
 *
 * @layer Features
 */
export interface PageEventHandlerContext {
  dispatch: AppDispatch
  queryClient: QueryClient
  userId: string | null
}
