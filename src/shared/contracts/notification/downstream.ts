/**
 * DOWNSTREAM CONTRACTS (Server -> Client)
 * Domain: Notification
 */

export interface NotificationDownstreamEvent {
  type: 'notification:new'
  payload: {
    id: string
    title: string
    body: string
  }
}
