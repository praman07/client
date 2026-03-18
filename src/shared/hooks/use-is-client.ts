import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * A safe way to detect if we're rendering on the client vs server/SSR without
 * causing hydration mismatch errors or using side-effects.
 * 
 * Returns \`false\` on the server and during the initial hydration pass.
 * Returns \`true\` on the client after hydration is complete.
 */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true, // Client snapshot
    () => false, // Server snapshot
  )
}
