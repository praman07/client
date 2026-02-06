/**
 * Presence Downstream Contracts - Placeholder
 * TODO: Implement when presence feature is developed
 */

export type PresenceDownstreamContract = {
  type: 'presence:update'
  payload: {
    userId: string
    status: 'online' | 'offline' | 'away'
  }
}
