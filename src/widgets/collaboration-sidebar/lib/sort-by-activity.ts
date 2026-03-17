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
 * Sort collaborators by activity
 *
 * Active users appear first, then sorted by most recent activity
 */
export function sortByActivity(
  collaborators: Array<CollaboratorPresence>,
): Array<CollaboratorPresence> {
  return [...collaborators].sort((a, b) => {
    // Active users first
    if (a.isActive && !b.isActive) return -1
    if (!a.isActive && b.isActive) return 1

    // Then by last activity timestamp
    return b.lastActivity.getTime() - a.lastActivity.getTime()
  })
}
