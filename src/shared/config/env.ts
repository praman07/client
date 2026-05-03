import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  clientPrefix: 'VITE_',

  client: {
    /** Base URL of the API server (e.g. https://api.collabifyy.com) */
    VITE_SERVER_URL: z.string().url(),
    /** WebSocket URL of the API server (e.g. wss://api.collabifyy.com/ws) */
    VITE_WS_URL: z.string().url(),
    /** Clerk publishable key for authentication */
    VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    /** Microsoft Clarity project ID for session recordings (optional) */
    VITE_CLARITY_PROJECT_ID: z.string().min(1).optional(),
  },

  runtimeEnv: import.meta.env,

  /**
   * Treat empty strings as undefined so Zod defaults and optional checks
   * work correctly when a variable is set but left blank in .env files.
   */
  emptyStringAsUndefined: true,
})
