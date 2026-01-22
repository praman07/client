import { HugeiconsIcon } from '@hugeicons/react'
import {
  SentIcon,
  Attachment01Icon,
  SmileIcon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/shared/ui/primitives/button'
import { Textarea } from '@/shared/ui/primitives/textarea'

export function MessageInput() {
  return (
    <div className="p-4 pt-2">
      <div className="relative rounded-xl border bg-background shadow-sm focus-within:ring-1 ring-ring">
        <div className="flex gap-1 p-2 border-b bg-muted/20 rounded-t-xl">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground"
          >
            <span className="font-bold text-xs">B</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground italic"
          >
            <span className="font-bold text-xs">I</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground line-through"
          >
            <span className="font-bold text-xs">S</span>
          </Button>
        </div>
        <Textarea
          placeholder="Message #general..."
          className="min-h-[80px] w-full resize-none border-0 bg-transparent p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-between p-2">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
            >
              <HugeiconsIcon icon={Attachment01Icon} className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
            >
              <HugeiconsIcon icon={SmileIcon} className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" className="gap-2">
            Send
            <HugeiconsIcon icon={SentIcon} className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-1 text-center">
        <span className="text-[10px] text-muted-foreground">
          <strong>Return</strong> to send, <strong>Shift + Return</strong> for
          new line
        </span>
      </div>
    </div>
  )
}
