import { Folder, Clock, FileText } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-6">
        <Folder className="h-24 w-24 text-muted-foreground/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <FileText className="h-12 w-12 text-muted-foreground/40" />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">No boards yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Get started by creating your first whiteboard. Click the "New Board"
        button to begin.
      </p>

      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Your boards will appear here</span>
      </div>
    </div>
  )
}
