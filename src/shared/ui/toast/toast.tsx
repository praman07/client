/**
 * Reusable Toast Components
 * 
 * Generic, theme-aware toast components with variant support.
 * Works for any notification type via config-driven styling.
 */

import { toast as sonnerToast } from 'sonner'
import type { ToastData, ToastVariant } from './types'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { cn } from '@/shared/lib/utils'

/**
 * Variant styling configuration
 */
const variantStyles: Record<ToastVariant, {
  border: string
  indicatorBg: string
  indicatorText: string
}> = {
  default: {
    border: 'border-l-4 border-l-accent-primary',
    indicatorBg: 'bg-accent-primary/10',
    indicatorText: 'text-accent-primary',
  },
  mention: {
    border: 'border-l-4 border-l-warning-primary',
    indicatorBg: 'bg-warning-subtle',
    indicatorText: 'text-warning-primary',
  },
  reply: {
    border: 'border-l-4 border-l-success-primary',
    indicatorBg: 'bg-success-subtle',
    indicatorText: 'text-success-primary',
  },
  success: {
    border: 'border-l-4 border-l-success-primary',
    indicatorBg: 'bg-success-subtle',
    indicatorText: 'text-success-primary',
  },
  error: {
    border: 'border-l-4 border-l-danger-primary',
    indicatorBg: 'bg-danger-subtle',
    indicatorText: 'text-danger-primary',
  },
  warning: {
    border: 'border-l-4 border-l-warning-primary',
    indicatorBg: 'bg-warning-subtle',
    indicatorText: 'text-warning-primary',
  },
  system: {
    border: 'border-l-4 border-l-accent-primary',
    indicatorBg: 'bg-accent-subtle',
    indicatorText: 'text-accent-primary',
  },
}

/**
 * Get user initials from name
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * User avatar component for toast
 */
function UserAvatar({ name, avatarUrl, className }: { name: string; avatarUrl?: string | null; className?: string }) {
  return (
    <Avatar className={cn('size-8', className)}>
      <AvatarImage src={avatarUrl ?? undefined} alt={name} />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}

/**
 * Get variant-specific indicator label
 */
function getVariantIndicator(variant: ToastVariant): React.ReactNode {
  switch (variant) {
    case 'mention':
      return (
        <span className="text-11 font-medium px-2 py-0.5 rounded-full bg-warning-subtle text-warning-primary">
          @mentioned you
        </span>
      )
    case 'reply':
      return (
        <span className="text-11 font-medium px-2 py-0.5 rounded-full bg-success-subtle text-success-primary">
          replied to your message
        </span>
      )
    case 'success':
      return (
        <span className="text-11 font-medium px-2 py-0.5 rounded-full bg-success-subtle text-success-primary">
          Success
        </span>
      )
    case 'error':
      return (
        <span className="text-11 font-medium px-2 py-0.5 rounded-full bg-danger-subtle text-danger-primary">
          Error
        </span>
      )
    case 'warning':
      return (
        <span className="text-11 font-medium px-2 py-0.5 rounded-full bg-warning-subtle text-warning-primary">
          Warning
        </span>
      )
    default:
      return null
  }
}

/**
 * Navigate to toast destination
 */
function handleToastNavigation(navigation?: ToastData['navigation']) {
  if (!navigation) return
  
  switch (navigation.type) {
    case 'conversation':
      console.log('Navigate to conversation:', navigation.id)
      break
    case 'thread':
      console.log('Navigate to thread:', navigation.id, navigation.params)
      break
    case 'issue':
      console.log('Navigate to issue:', navigation.id)
      break
    case 'page':
      console.log('Navigate to page:', navigation.id)
      break
    default:
      break
  }
}

/**
 * Render a toast using the generic layout
 */
function renderToast(data: ToastData) {
  const styles = variantStyles[data.variant]
  const indicator = getVariantIndicator(data.variant)
  
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 bg-surface-2 border border-subtle rounded-lg shadow-overlay-100 cursor-pointer hover:bg-layer-1-hover transition-colors w-96',
        styles.border
      )}
    >
      {/* Avatar */}
      {data.user ? (
        <UserAvatar
          name={data.user.name}
          avatarUrl={data.user.avatarUrl}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-layer-2 flex items-center justify-center">
          <span className="text-11 font-medium text-tertiary">?</span>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-13 truncate">{data.title}</span>
          {indicator}
        </div>
        
        {data.subtitle && (
          <div className="text-12 text-tertiary truncate mt-0.5">
            {data.subtitle}
          </div>
        )}
        
        {data.body && (
          <p className="text-13 mt-1 truncate text-primary/80">
            {data.body}
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Show a toast with the given data
 */
export function showToast(data: ToastData) {
  const handleClick = () => {
    handleToastNavigation(data.navigation)
  }
  
  sonnerToast.custom(
    (t) => (
      <div
        onClick={() => {
          handleClick()
          sonnerToast.dismiss(t)
        }}
      >
        {renderToast(data)}
      </div>
    ),
    {
      duration: data.duration ?? 5000,
      unstyled: true,
      className: 'p-0 bg-transparent shadow-none',
    }
  )
}

/**
 * Show a toast from an event type string
 * Uses the toast registry to enrich and render
 */
export async function showToastFromEvent(
  eventType: string,
  payload: unknown
): Promise<void> {
  const config = (await import('./config')).getToastConfig(eventType)
  
  if (!config) {
    console.warn(`No toast config found for event type: ${eventType}`)
    return
  }
  
  const enriched = config.enricher(payload)
  const data = enriched instanceof Promise ? await enriched : enriched
  showToast(data)
}

/**
 * Convenience methods for common toast types
 */
export const toasts = {
  mention: (data: ToastData) => showToast({ ...data, variant: 'mention' }),
  reply: (data: ToastData) => showToast({ ...data, variant: 'reply' }),
  success: (title: string, body?: string) => showToast({
    id: `success-${Date.now()}`,
    variant: 'success',
    title,
    body,
    duration: 4000,
  }),
  error: (title: string, body?: string) => showToast({
    id: `error-${Date.now()}`,
    variant: 'error',
    title,
    body,
    duration: 8000,
  }),
  info: (title: string, body?: string) => showToast({
    id: `info-${Date.now()}`,
    variant: 'default',
    title,
    body,
    duration: 5000,
  }),
}
