import { useAppSelector } from '@/shared/hooks'
import { Badge } from '@/shared/ui/primitives/badge'
import { Wifi, WifiOff } from 'lucide-react'

export function ConnectionIndicator({
  boardId: _boardId,
}: {
  boardId: string
}) {
  const connectionStatus = useAppSelector(
    (state) => state.whiteboardSession.connectionStatus,
  )

  const isConnected = connectionStatus === 'connected'

  return (
    <div className="absolute top-4 right-4 z-50">
      <Badge
        variant={isConnected ? 'default' : 'destructive'}
        className="flex items-center gap-2"
      >
        {isConnected ? (
          <>
            <Wifi className="h-3 w-3" />
            Connected
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            Offline
          </>
        )}
      </Badge>
    </div>
  )
}
