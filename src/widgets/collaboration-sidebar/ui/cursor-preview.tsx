import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui/primitives/tooltip'

interface CursorPreviewProps {
  color: string
}

/**
 * Small colored dot showing the user's cursor color
 *
 * @layer Widgets
 * @module collaboration-sidebar
 */
export function CursorPreview({ color }: CursorPreviewProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className="h-3 w-3 rounded-full border border-border shadow-sm shrink-0"
          style={{ backgroundColor: color }}
          aria-label="Cursor color"
        />
      </TooltipTrigger>
      <TooltipContent side="left">
        <p className="text-xs">Cursor color</p>
      </TooltipContent>
    </Tooltip>
  )
}
