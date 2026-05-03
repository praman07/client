import { Eye, UserMinus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { AppPermission } from '@/shared/lib/auth'

export interface MemberAction {
  key: string
  label: string
  icon: LucideIcon
  permission: AppPermission
  /** Returns true if this action is available given actor rank vs target rank */
  isAvailable: (actorRank: number, targetRank: number) => boolean
  variant?: 'default' | 'destructive'
}

/**
 * Centralized action registry for workspace member rows.
 * Guards are evaluated at render time — permission check + rank check.
 * Add new actions here; UI components read from this registry dynamically.
 */
export const MEMBER_ACTIONS: Array<MemberAction> = [
  {
    key: 'view-profile',
    label: 'View Profile',
    icon: Eye,
    permission: 'workspace:member:read',
    isAvailable: () => true,
    variant: 'default',
  },
  {
    key: 'remove',
    label: 'Remove Member',
    icon: UserMinus,
    permission: 'workspace:member:remove',
    // Actor must strictly outrank target to remove
    isAvailable: (actorRank, targetRank) => actorRank > targetRank,
    variant: 'destructive',
  },
]
