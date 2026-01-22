import React from 'react'
import { cn } from '@/shared/lib/utils'
import { Loader2, WifiOff, AlertCircle } from 'lucide-react'
import { SessionStatus } from '../model/types'

interface SyncStatusIndicatorProps {
  status: SessionStatus
  className?: string
}

export function SyncStatusIndicator({
  status,
  className,
}: SyncStatusIndicatorProps) {
  if (status === 'IN_SYNC') return null

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full',
        className,
        {
          'bg-yellow-500/10 text-yellow-500': status === 'RECOVERING',
          'bg-red-500/10 text-red-500': status === 'DESYNCED',
          'bg-slate-500/10 text-slate-500': status === 'OFFLINE',
        },
      )}
    >
      {status === 'RECOVERING' && (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Syncing...</span>
        </>
      )}
      {status === 'DESYNCED' && (
        <>
          <AlertCircle className="w-3 h-3" />
          <span>Connection Lost</span>
        </>
      )}
      {status === 'OFFLINE' && (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Offline</span>
        </>
      )}
    </div>
  )
}
