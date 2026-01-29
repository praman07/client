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
        'flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full',
        className,
        {
          'bg-blue-500/10 text-blue-500': status === 'FETCHING',
          'bg-yellow-500/10 text-yellow-500': status === 'RECOVERING',
          'bg-red-500/10 text-red-500': status === 'DESYNCED',
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
