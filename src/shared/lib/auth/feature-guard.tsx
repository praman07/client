/**
 * feature-guard.tsx
 *
 * Renders children only when the specified feature flag is enabled
 * for the current user/workspace/project scope.
 *
 * Usage:
 *   <FeatureGuard flag="ai.summary">
 *     <AISummaryPanel />
 *   </FeatureGuard>
 *
 *   <FeatureGuard flag="vault.video-preview" fallback={<ComingSoonBadge />}>
 *     <VideoPreview />
 *   </FeatureGuard>
 */
import React from 'react'
import { useFeatureFlag } from './use-feature-flag'

interface FeatureGuardProps {
  flag: string
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function FeatureGuard({
  flag,
  fallback = null,
  children,
}: FeatureGuardProps) {
  const enabled = useFeatureFlag(flag)
  if (!enabled) return <>{fallback}</>
  return <>{children}</>
}
