/**
 * guard.tsx
 *
 * Renders children only when the current user has the required permission.
 * Renders `fallback` (default: null) when loading or permission denied.
 *
 * Usage:
 *   <Guard permission="workspace:delete">
 *     <DeleteWorkspaceButton />
 *   </Guard>
 *
 *   <Guard permission="project:member:add" fallback={<ReadOnlyBadge />}>
 *     <AddMemberButton />
 *   </Guard>
 */
import React from 'react'
import { usePermission } from './use-permission'
import type { AppPermission } from './app-permission'

interface GuardProps {
  permission: AppPermission
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function Guard({ permission, fallback = null, children }: GuardProps) {
  const allowed = usePermission(permission)
  if (!allowed) return <>{fallback}</>
  return <>{children}</>
}
