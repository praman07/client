// Public API — features/pages/events

// Upstream actions (called by widgets)
export { subscribePage } from './api/subscribe-page'
export { unsubscribePage } from './api/unsubscribe-page'
export { sendPageUpdate } from './api/send-page-update'
export { sendAwarenessUpdate } from './api/send-awareness-update'

// Y.Doc + Awareness registration (called by widgets/page-editor on mount/unmount)
export {
  registerPageYDoc,
  unregisterPageYDoc,
} from './lib/handlers/page-update'
export {
  registerPageAwarenessProvider,
  unregisterPageAwarenessProvider,
} from './lib/handlers/awareness-update'

// Handler registration (called by app plugin)
export { registerPageHandlers } from './lib/register-handlers'

// Types
export type { PageEventHandlerContext } from './model'
