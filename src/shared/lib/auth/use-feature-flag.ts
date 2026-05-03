/**
 * use-feature-flag.ts
 *
 * Returns the resolved boolean value of a feature flag
 * for the current user/workspace/project scope.
 *
 * Falls back to false when loading or flag unknown.
 *
 * Usage:
 *   const aiEnabled = useFeatureFlag('ai.summary')
 *   if (!aiEnabled) return null
 */
import { useAuthorizationContext } from './authorization-provider'

export function useFeatureFlag(key: string): boolean {
  const { featureFlags, isLoading } = useAuthorizationContext()
  if (isLoading) return false
  return featureFlags[key] ?? false
}
