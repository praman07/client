import { ArrowDown } from 'lucide-react'
import { Button } from '@/shared/ui/primitives/button'

interface ScrollToBottomButtonProps {
  onClick: () => void
  show: boolean
  newMessagesCount?: number
}

export function ScrollToBottomButton({
  onClick,
  show,
  newMessagesCount = 0,
}: ScrollToBottomButtonProps) {
  if (!show) return null

  return (
    <div className="sticky bottom-4 w-full flex justify-center z-[var(--z-dropdown)] pointer-events-none">
      <Button
        size="sm"
        variant="secondary"
        className="rounded-full shadow-overlay-100 pointer-events-auto h-8 px-3 gap-1.5 opacity-90 hover:opacity-100 transition-all animate-in slide-in-from-bottom-2 duration-200"
        onClick={onClick}
      >
        <ArrowDown className="size-3.5" />
        <span className="text-11 font-medium">
          {newMessagesCount > 0 ? `${newMessagesCount} new` : 'New Messages'}
        </span>
      </Button>
    </div>
  )
}
