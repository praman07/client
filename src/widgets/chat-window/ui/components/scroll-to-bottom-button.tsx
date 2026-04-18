import { ArrowDownIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/shared/ui/primitives/button'

interface ScrollToBottomButtonProps {
  onClick: () => void
  show: boolean
}

export function ScrollToBottomButton({
  onClick,
  show,
}: ScrollToBottomButtonProps) {
  if (!show) return null

  return (
    <div className="sticky bottom-4 w-full flex justify-center z-50 pointer-events-none">
      <Button
        size="sm"
        variant="secondary"
        className="rounded-full shadow-overlay-100 pointer-events-auto h-8 px-3 gap-1.5 opacity-90 hover:opacity-100 transition-all animate-in slide-in-from-bottom-2 duration-200"
        onClick={onClick}
      >
        <HugeiconsIcon icon={ArrowDownIcon} className="size-3.5" />
        <span className="text-xs font-medium">New Messages</span>
      </Button>
    </div>
  )
}
