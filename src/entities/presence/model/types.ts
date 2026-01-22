export type UserPresenceStatus = 'online' | 'offline' | 'away'

export interface PresenceState {
  // Map<UserId, Status>
  users: Record<string, UserPresenceStatus>
  lastUpdated: number
}
