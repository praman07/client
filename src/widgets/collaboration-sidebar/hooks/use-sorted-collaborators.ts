import { useMemo } from 'react'

export interface CollaboratorPresence {
  userId: string
  fullName: string
  email: string
  avatarUrl?: string
  cursor: {
    x: number
    y: number
    color: string
  }
  isActive: boolean
  lastActivity: Date
}

/**
 * Hook to get sorted collaborators (most recently active first)
 *
 * @param collaborators - List of collaborators to sort
 * @returns Sorted collaborators array
 */
export function useSortedCollaborators(
  collaborators: CollaboratorPresence[],
): CollaboratorPresence[] {
  return useMemo(() => {
    return [...collaborators].sort((a, b) => {
      // Active users first
      if (a.isActive && !b.isActive) return -1
      if (!a.isActive && b.isActive) return 1

      // Then by last activity
      return b.lastActivity.getTime() - a.lastActivity.getTime()
    })
  }, [collaborators])
}
