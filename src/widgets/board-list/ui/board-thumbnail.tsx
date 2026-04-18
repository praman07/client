import { FileImage } from 'lucide-react'
import { useBoardThumbnail } from '../hooks'

interface BoardThumbnailProps {
  boardId: string
}

/**
 * Board thumbnail preview
 *
 * Uses object-contain so the full drawing is always visible (no cropping).
 * The muted background frames the thumbnail cleanly regardless of drawing
 * aspect ratio.
 */
export function BoardThumbnail({ boardId }: BoardThumbnailProps) {
  const thumbnail = useBoardThumbnail(boardId)

  if (thumbnail) {
    return (
      <div className="relative w-full aspect-video bg-layer-2/60 overflow-hidden flex items-center justify-center">
        <img
          src={thumbnail}
          alt="Board preview"
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  // Placeholder when no thumbnail available
  return (
    <div className="relative w-full aspect-video bg-layer-2/60 overflow-hidden flex items-center justify-center">
      <FileImage className="h-10 w-10 text-tertiary/25" />
    </div>
  )
}
