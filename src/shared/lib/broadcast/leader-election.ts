/**
 * Leader Election implementation using BroadcastChannel.
 * Implements a simplified Bully algorithm with heartbeat watchdog.
 */

import { createLogger } from '@/shared/lib/logger'

const HEARTBEAT_INTERVAL_MS = 1000
const LEADER_TIMEOUT_MS = 5000

const log = createLogger('ws:leader')

type BroadcastEvent =
  | { type: 'HELLO'; tabId: string }
  | { type: 'HEARTBEAT'; tabId: string }
  | { type: 'LEADER_CLAIM'; tabId: string }
   
  | { type: 'WS_RELAY'; payload: any }
// WS Relay events can be added later

export type LeaderState = 'LEADER' | 'FOLLOWER' | 'ELECTION'

export class LeaderElection {
  private channel: BroadcastChannel
  private tabId: string
  private state: LeaderState = 'ELECTION'
  private leaderId: string | null = null
  private lastHeartbeatMs = 0
  private checkInterval: ReturnType<typeof setInterval> | null = null
  private boundHandleMessage: (ev: MessageEvent<BroadcastEvent>) => void

  private listeners: Array<(state: LeaderState) => void> = []
   
  private relayListeners: Array<(payload: any) => void> = []

  constructor(channelName = 'collabify_leader_election') {
    this.tabId = crypto.randomUUID()
    this.channel = new BroadcastChannel(channelName)
    this.boundHandleMessage = this.handleMessage.bind(this)
    this.channel.addEventListener('message', this.boundHandleMessage)

    // Start Election Cycle
    this.startElection()
  }

  private startElection() {
    this.state = 'ELECTION'
    this.leaderId = null
    this.notify()

    // Announce existence
    this.broadcast({ type: 'HELLO', tabId: this.tabId })

    // Check for leader periodically
    this.checkInterval = setInterval(
      () => this.runHealthCheck(),
      HEARTBEAT_INTERVAL_MS,
    )
  }

  private runHealthCheck() {
    const now = Date.now()

    if (this.state === 'LEADER') {
      // I am leader, send heartbeat
      this.broadcast({ type: 'HEARTBEAT', tabId: this.tabId })
      return
    }

    // Follower / Election mode
    if (this.leaderId) {
      // Check if leader died
      // Watchdog: If no heartbeat in 5000ms, assume leader is dead/frozen.
      if (now - this.lastHeartbeatMs > LEADER_TIMEOUT_MS) {
        log.warn(
          `Leader ${this.leaderId} timed out (Watchdog). Promoting self.`,
        )
        this.promoteSelf()
      }
    } else {
      // No leader seen for a while.
      this.promoteSelf()
    }
  }

  private promoteSelf() {
    const delay = Math.random() * 300 // Random delay to prevent thundering herd
    setTimeout(() => {
      // Re-check conditions after delay
      const now = Date.now()
      if (this.state === 'LEADER') return

      // If we heard from a leader recently (race condition resolved), abort
      if (this.leaderId && now - this.lastHeartbeatMs < LEADER_TIMEOUT_MS)
        return

      this.state = 'LEADER'
      this.leaderId = this.tabId
      this.broadcast({ type: 'LEADER_CLAIM', tabId: this.tabId })
      this.broadcast({ type: 'HEARTBEAT', tabId: this.tabId }) // Immediate beat
      this.notify()
    }, delay)
  }

  private handleMessage(ev: MessageEvent<BroadcastEvent>) {
    const data = ev.data

    switch (data.type) {
      case 'WS_RELAY':
        this.notifyRelay(data.payload)
        break
      case 'HEARTBEAT':
      case 'LEADER_CLAIM':
        if (data.tabId === this.tabId) return // Ignore self

        if (this.state === 'LEADER') {
          // Conflict Resolution: Lexicographical ID comparison.
          if (data.tabId < this.tabId) {
            // Lower ID wins.
            this.demote()
            this.leaderId = data.tabId
            this.lastHeartbeatMs = Date.now()
          } else {
            // We win. Re-assert leadership.
            this.broadcast({ type: 'LEADER_CLAIM', tabId: this.tabId })
          }
        } else {
          // I am follower, acknowledge this leader
          this.state = 'FOLLOWER'
          this.leaderId = data.tabId
          this.lastHeartbeatMs = Date.now()
          this.notify()
        }
        break

      case 'HELLO':
        if (this.state === 'LEADER') {
          // New tab joined, say hello back
          this.broadcast({ type: 'HEARTBEAT', tabId: this.tabId })
        }
        break
    }
  }

  private demote() {
    this.state = 'FOLLOWER'
    this.notify()
  }

  private broadcast(entry: BroadcastEvent) {
    this.channel.postMessage(entry)
  }

  subscribe(cb: (state: LeaderState) => void) {
    this.listeners.push(cb)
    cb(this.state) // Initial emit
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb)
    }
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.state))
  }

   
  private notifyRelay(payload: any) {
    this.relayListeners.forEach((cb) => cb(payload))
  }

  isLeader() {
    return this.state === 'LEADER'
  }

  destroy() {
    if (this.checkInterval) clearInterval(this.checkInterval)
    this.channel.removeEventListener('message', this.boundHandleMessage)
    this.channel.close()
    this.listeners = []
    this.relayListeners = []
  }

  // API for Event Router
   
  relay(payload: any) {
    this.channel.postMessage({ type: 'WS_RELAY', payload })
  }

   
  onRelay(cb: (payload: any) => void) {
    this.relayListeners.push(cb)
    return () => {
      this.relayListeners = this.relayListeners.filter((l) => l !== cb)
    }
  }
}

export const leaderElection = new LeaderElection()
