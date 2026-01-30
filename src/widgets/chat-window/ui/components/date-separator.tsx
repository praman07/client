import { Separator } from '@/shared/ui/primitives/separator'
import { cn } from '@/shared/lib/utils'

interface DateSeparatorProps {
  timestamp: number
  className?: string
}

export function DateSeparator({ timestamp, className }: DateSeparatorProps) {
  return (
    <div className={cn('flex items-center gap-4 px-4 my-6', className)}>
      <Separator className="flex-1" />
      <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
        {new Intl.DateTimeFormat('en-US', {
          dateStyle: 'long',
        }).format(new Date(timestamp))}
      </span>
      <Separator className="flex-1" />
    </div>
  )
}
