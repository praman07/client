/**
 * Toast Notification Framework
 * 
 * Architecture:
 * - Central config registry (toast-config.ts)
 * - Data enrichment layer (enricher.ts)
 * - Generic toast component (chat-toast.tsx)
 * - Registry-based rendering (toast-registry.ts)
 */

import type { ReactNode } from 'react'

/**
 * Toast variant definitions
 * Add new notification types here - no other changes needed
 */
export type ToastVariant = 'default' | 'mention' | 'reply' | 'system' | 'success' | 'error' | 'warning'

/**
 * Core toast metadata
 */
export interface ToastMeta {
  id: string
  variant: ToastVariant
  duration?: number
  dismissible?: boolean
  persistent?: boolean
}

/**
 * Toast content structure
 */
export interface ToastContent {
  /** Primary label (e.g., "John Doe sent a message") */
  title: string
  /** Secondary info (e.g., channel name, conversation) */
  subtitle?: string
  /** Message preview or body */
  body?: string
  /** Icon or indicator element */
  indicator?: ReactNode
  /** Action button or link */
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * User info for avatar display
 */
export interface ToastUser {
  id: string
  name: string
  avatarUrl?: string | null
}

/**
 * Navigation context for click actions
 */
export interface ToastNavigation {
  type: 'conversation' | 'thread' | 'issue' | 'page' | 'workspace' | 'external'
  id: string
  params?: Record<string, string>
}

/**
 * Complete toast data structure
 */
export interface ToastData extends ToastMeta, ToastContent {
  user?: ToastUser
  navigation?: ToastNavigation
  timestamp?: string
}

/**
 * Config entry for each notification type
 */
export interface ToastConfigEntry {
  variant: ToastVariant
  duration: number
  enricher: (payload: unknown) => Promise<ToastData> | ToastData
  renderCustom?: (data: ToastData) => ReactNode
}

/**
 * Registry of all toast configurations
 * Add new notification types here
 */
export const TOAST_REGISTRY: Record<string, ToastConfigEntry> = {}

/**
 * Register a toast configuration
 */
export function registerToastConfig(
  eventType: string,
  config: ToastConfigEntry
) {
  TOAST_REGISTRY[eventType] = config
}

/**
 * Get toast config for an event type
 */
export function getToastConfig(eventType: string): ToastConfigEntry | undefined {
  return TOAST_REGISTRY[eventType]
}
