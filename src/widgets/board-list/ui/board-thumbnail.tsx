import { FileImage } from 'lucide-react'

interface BoardThumbnailProps {
  boardId: string
  thumbnail?: string | null
}

/**
 * Board thumbnail preview
 *
 * Shows canvas snapshot or placeholder icon
 */
export function BoardThumbnail({ thumbnail }: BoardThumbnailProps) {
  if (thumbnail) {
    return (
      <div className="relative w-full aspect-video bg-muted rounded-t-lg overflow-hidden">
        <img
          src={thumbnail}
          alt="Board preview"
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  // Placeholder when no thumbnail
  return (
    <div className="relative w-full aspect-video bg-linear-to-br from-muted to-muted/50 rounded-t-lg overflow-hidden flex items-center justify-center">
      <FileImage className="h-12 w-12 text-muted-foreground/20" />
    </div>
  )
}
