import { AlertCircle, RefreshCw } from 'lucide-react'
import type { FallbackProps } from 'react-error-boundary'
import { Button } from '@/shared/ui/primitives'

export function WidgetError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="h-full w-full min-h-[120px] p-4 flex items-center justify-center border-2 border-dashed border-destructive/20 rounded-lg bg-destructive/5 animate-in fade-in">
      <div className="flex flex-col items-center text-center gap-3 max-w-xs">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium text-sm">Widget Error</span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">
          {error instanceof Error ? error.message : 'Component failed to load'}
        </p>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
          onClick={resetErrorBoundary}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Widget
        </Button>
      </div>
    </div>
  )
}
