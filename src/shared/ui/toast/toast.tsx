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
    border: 'border-l-4 border-l-blue-500',
    indicatorBg: 'bg-blue-500/10',
    indicatorText: 'text-blue-600 dark:text-blue-400',
  },
  mention: {
    border: 'border-l-4 border-l-orange-500',
    indicatorBg: 'bg-orange-500/10',
    indicatorText: 'text-orange-600 dark:text-orange-400',
  },
  reply: {
    border: 'border-l-4 border-l-green-500',
    indicatorBg: 'bg-green-500/10',
    indicatorText: 'text-green-600 dark:text-green-400',
  },
  success: {
    border: 'border-l-4 border-l-emerald-500',
    indicatorBg: 'bg-emerald-500/10',
    indicatorText: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    border: 'border-l-4 border-l-red-500',
    indicatorBg: 'bg-red-500/10',
    indicatorText: 'text-red-600 dark:text-red-400',
  },
  warning: {
    border: 'border-l-4 border-l-amber-500',
    indicatorBg: 'bg-amber-500/10',
    indicatorText: 'text-amber-600 dark:text-amber-400',
  },
  system: {
    border: 'border-l-4 border-l-purple-500',
    indicatorBg: 'bg-purple-500/10',
    indicatorText: 'text-purple-600 dark:text-purple-400',
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
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
          @mentioned you
        </span>
      )
    case 'reply':
      return (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
          replied to your message
        </span>
      )
    case 'success':
      return (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          Success
        </span>
      )
    case 'error':
      return (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
          Error
        </span>
      )
    case 'warning':
      return (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
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
        'flex items-start gap-3 p-3 bg-popover border rounded-lg shadow-lg cursor-pointer hover:bg-accent/50 transition-colors w-96',
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
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs font-medium text-muted-foreground">?</span>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm truncate">{data.title}</span>
          {indicator}
        </div>
        
        {data.subtitle && (
          <div className="text-xs text-muted-foreground truncate mt-0.5">
            {data.subtitle}
          </div>
        )}
        
        {data.body && (
          <p className="text-sm mt-1 truncate text-foreground/80">
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
