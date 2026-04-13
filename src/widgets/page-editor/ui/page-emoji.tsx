import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useUpdatePageDetails } from '@/features/pages/update-page-details'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/primitives/popover'

interface PageEmojiProps {
  icon: string | null
  hasCover: boolean
  isLocked: boolean
}

/**
 * PageEmojiPicker — emoji button positioned between cover and title.
 *
 * When cover exists: -mt-8 mb-2 so emoji overlaps bottom edge of cover (Notion-style).
 * When no cover: shown above title with subtle hover prompt.
 * On click: opens emoji-mart Picker in a Popover.
 * On select: calls updatePageDetails({ emoji }), closes picker immediately.
 *
 * @layer Widgets
 */
export function PageEmojiPicker({ icon, hasCover, isLocked }: PageEmojiProps) {
  const { pageId } = useParams({ strict: false })
  const project = useAppSelector(selectCurrentProject)
  const { mutate: updatePageDetails } = useUpdatePageDetails()
  const [open, setOpen] = useState(false)

  const handleSelect = (emoji: { native: string }) => {
    if (!pageId || !project?.id || isLocked) return
    setOpen(false)
    updatePageDetails({ pageId: pageId, projectId: project.id, emoji: emoji.native })
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!pageId || !project?.id || isLocked) return
    updatePageDetails({ pageId: pageId, projectId: project.id, emoji: null })
  }

  return (
    <div className={`flex items-center gap-2 ${hasCover ? '-mt-8 mb-2' : 'mb-2'}`}>
      <Popover open={open} onOpenChange={isLocked ? undefined : setOpen}>
        <PopoverTrigger>
          <button
            disabled={isLocked}
            className={`
              text-5xl leading-none select-none rounded-lg p-1 transition-colors
              ${icon ? 'hover:bg-accent' : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent text-2xl'}
              disabled:cursor-default disabled:hover:bg-transparent
            `}
            title={icon ? 'Change emoji' : 'Add emoji'}
          >
            {icon ?? '😶'}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border-none shadow-lg z-[100]"
          sideOffset={4}
          align="start"
        >
          <Picker
            data={data}
            onEmojiSelect={handleSelect}
            theme="auto"
            previewPosition="none"
            skinTonePosition="none"
          />
        </PopoverContent>
      </Popover>

      {icon && !isLocked && (
        <button
          onClick={handleRemove}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-accent"
        >
          Remove emoji
        </button>
      )}
    </div>
  )
}
