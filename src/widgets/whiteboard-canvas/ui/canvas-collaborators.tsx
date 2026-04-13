import {
  CollaboratorAvatar,
  useActiveCollaborators,
} from '@/entities/whiteboard-presence'

/**
 * CanvasCollaborators
 *
 * Inline avatar strip rendered via Excalidraw's `renderTopRightUI` prop.
 * Shows up to 5 active collaborators, then a "+N more" indicator.
 * Replaces the legacy CollaborationSidebar for the presence view.
 */
export function CanvasCollaborators() {
  const { collaborators } = useActiveCollaborators()

  if (collaborators.length === 0) return null

  const MAX_VISIBLE = 5
  const visible = collaborators.slice(0, MAX_VISIBLE)
  const overflow = collaborators.length - MAX_VISIBLE

  return (
    <div className="flex items-center gap-1.5 pr-2">
      {visible.map((collab) => (
        <CollaboratorAvatar
          key={collab.userId}
          userName={collab.fullName}
          avatarUrl={collab.avatarUrl}
          color={collab.color}
          isIdle={collab.isIdle}
        />
      ))}
      {overflow > 0 && (
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground">
          +{overflow}
        </div>
      )}
    </div>
  )
}
