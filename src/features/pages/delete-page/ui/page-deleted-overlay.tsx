/**
 * PageDeletedOverlay
 *
 * Full-screen blocking overlay shown when the page a user is viewing
 * is deleted by another collaborator (triggered by page:deleted WS event).
 *
 * Non-dismissable — the only exit is the CTA button.
 * Mirrors BoardDeletedOverlay from features/whiteboard/delete-board.
 *
 * @layer Features
 */

import { useNavigate } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/primitives/button'

export interface PageDeletedOverlayProps {
  workspaceSlug: string
  projectSlug: string
}

export function PageDeletedOverlay({
  workspaceSlug,
  projectSlug,
}: PageDeletedOverlayProps) {
  const navigate = useNavigate()

  const handleGoToPages = () => {
    navigate({
      to: '/workspace/$workspaceSlug/project/$projectSlug',
      params: { workspaceSlug, projectSlug },
    })
  }

  return (
    <div className="absolute inset-0 z-[var(--z-modal)] flex items-center justify-center bg-backdrop backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-subtle">
          <Trash2 className="h-8 w-8 text-danger-primary" />
        </div>

        <div className="space-y-1">
          <h2 className="text-20 font-semibold tracking-tight">
            This page has been deleted
          </h2>
          <p className="text-13 text-secondary">
            A collaborator has permanently deleted this page.
          </p>
        </div>

        <Button onClick={handleGoToPages} className="mt-2">
          Go to Pages
        </Button>
      </div>
    </div>
  )
}
