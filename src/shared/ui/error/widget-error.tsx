import { AlertCircle, RefreshCw } from 'lucide-react'
import type { FallbackProps } from 'react-error-boundary'
import { Button } from '@/shared/ui/primitives'

export function WidgetError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="h-full w-full min-h-[120px] p-4 flex items-center justify-center border-2 border-dashed border-danger-strong rounded-lg bg-danger-subtle animate-in fade-in">
      <div className="flex flex-col items-center text-center gap-3 max-w-xs">
        <div className="flex items-center gap-2 text-danger-primary">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium text-13">Widget Error</span>
        </div>

        <p className="text-12 text-tertiary line-clamp-2">
          {error instanceof Error ? error.message : 'Component failed to load'}
        </p>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-12 text-danger-primary border-danger-strong hover:bg-danger-subtle hover:text-danger-primary"
          onClick={resetErrorBoundary}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Widget
        </Button>
      </div>
    </div>
  )
}
