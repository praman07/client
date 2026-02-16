import { Users } from 'lucide-react'

/**
 * Empty state component shown when no collaborators are present
 *
 * @layer Widgets
 * @module collaboration-sidebar
 */
export function EmptyCollaborators() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in-50 duration-300">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-muted/30 rounded-full blur-xl" />
        <Users
          className="relative h-12 w-12 text-muted-foreground/40"
          strokeWidth={1.5}
        />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">
        No collaborators yet
      </p>
      <p className="text-xs text-muted-foreground max-w-[200px]">
        You're the only one on this board right now
      </p>
    </div>
  )
}
