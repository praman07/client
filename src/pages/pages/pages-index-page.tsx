import { HugeiconsIcon } from '@hugeicons/react'
import { NoteIcon } from '@hugeicons/core-free-icons'
import { useCreatePageModal } from '@/features/pages/create-page'

/**
 * Pages empty state — shown at /pages (no page selected).
 *
 * Mirrored from the chat module's index.tsx empty state pattern.
 *
 * @layer Pages
 */
export function PagesIndexPage() {
  const { open } = useCreatePageModal()

  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground p-4 text-center">
      <div className="bg-muted/50 p-4 rounded-full mb-4">
        <HugeiconsIcon
          icon={NoteIcon}
          className="h-10 w-10 text-muted-foreground/50"
        />
      </div>
      <h3 className="text-lg font-medium text-foreground">No page selected</h3>
      <p className="max-w-xs text-sm mt-2">
        Select a page from the sidebar or{' '}
        <button
          className="underline underline-offset-2 hover:text-foreground transition-colors"
          onClick={() => open({ parentId: null })}
        >
          create one
        </button>{' '}
        to start writing.
      </p>
    </div>
  )
}
