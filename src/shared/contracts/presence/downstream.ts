/**
 * DOWNSTREAM CONTRACTS (Server -> Client)
 * Domain: Presence
 */

export interface PresenceEvent {
  type: 'presence:update'
  payload: {
    userId: string
    status: 'online' | 'offline' | 'away'
  }
}
