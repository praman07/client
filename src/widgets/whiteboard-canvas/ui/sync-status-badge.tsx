import { useAppSelector } from '@/shared/hooks'
import { Badge } from '@/shared/ui/primitives/badge'
import { Loader2, Check } from 'lucide-react'

export function SyncStatusBadge({ boardId: _boardId }: { boardId: string }) {
  const isSyncing = useAppSelector(
    (state) => state.whiteboardSession.isSyncing
  )
  const pendingCount = useAppSelector(
    (state) => state.whiteboardSession.pendingUpdateCount
  )
  
  if (!isSyncing && pendingCount === 0) {
    return (
      <div className="absolute top-4 right-32 z-50">
        <Badge variant="outline" className="flex items-center gap-2">
          <Check className="h-3 w-3 text-green-500" />
          Synced
        </Badge>
      </div>
    )
  }
  
  return (
    <div className="absolute top-4 right-32 z-50">
      <Badge variant="secondary" className="flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        {isSyncing ? 'Syncing...' : `${pendingCount} pending`}
      </Badge>
    </div>
  )
}
