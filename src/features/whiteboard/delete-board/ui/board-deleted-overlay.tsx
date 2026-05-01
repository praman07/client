/**
 * Board Deleted Overlay
 *
 * Role: Full-screen blocking overlay shown when the current board is deleted
 * Responsibility: Block canvas interaction and navigate user back to board list
 *
 * Architecture: Non-dismissable — only exit is the CTA button
 */

import { useNavigate } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/primitives/button'

interface BoardDeletedOverlayProps {
  workspaceSlug: string
  projectSlug: string
}

export function BoardDeletedOverlay({
  workspaceSlug,
  projectSlug,
}: BoardDeletedOverlayProps) {
  const navigate = useNavigate()

  const handleGoToBoards = () => {
    navigate({
      to: '/workspace/$workspaceSlug/project/$projectSlug',
      params: { workspaceSlug, projectSlug },
    })
  }

  return (
    <div className="absolute inset-0 z-[var(--z-overlay)] flex items-center justify-center bg-layer-transparent/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-subtle">
          <Trash2 className="h-8 w-8 text-danger-primary" />
        </div>

        <div className="space-y-1">
          <h2 className="text-18 font-semibold tracking-tight">
            This board has been deleted
          </h2>
          <p className="text-14 text-secondary">
            The creator has permanently deleted this board.
          </p>
        </div>

        <Button onClick={handleGoToBoards} className="mt-2">
          Go to Boards
        </Button>
      </div>
    </div>
  )
}
