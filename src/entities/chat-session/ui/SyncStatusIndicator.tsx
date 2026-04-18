import { AlertCircle, Loader2 } from 'lucide-react'
import type { ResequencerStatus } from '@/entities/stream-session'
import { cn } from '@/shared/lib/utils'

interface SyncStatusIndicatorProps {
  status: ResequencerStatus
  className?: string
}

export function SyncStatusIndicator({
  status,
  className,
}: SyncStatusIndicatorProps) {
  if (status === 'SYNCED') return null

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-11 font-medium px-3 py-1.5 rounded-full transition-colors duration-150',
        className,
        {
          'bg-accent-subtle text-accent-primary': status === 'FETCHING',
          'bg-warning-subtle text-warning-primary': status === 'RECOVERING',
          'bg-danger-subtle text-danger-primary': status === 'DESYNCED',
        },
      )}
    >
      {status === 'FETCHING' && (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Loading messages...</span>
        </>
      )}
      {status === 'RECOVERING' && (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Recovering...</span>
        </>
      )}
      {status === 'DESYNCED' && (
        <>
          <AlertCircle className="w-3 h-3" />
          <span>Sync failed</span>
        </>
      )}
    </div>
  )
}
