import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * ChatSkeleton
 * Message list placeholder: stacked bubbles alternating left/right.
 * Used as loading fallback on the chat/$conversationId route.
 */
export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-14 border-b flex items-center px-4 gap-3 shrink-0">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Message list */}
      <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
        {[
          { align: 'left', widths: ['w-48', 'w-64'] },
          { align: 'right', widths: ['w-56'] },
          { align: 'left', widths: ['w-72', 'w-40'] },
          { align: 'right', widths: ['w-48', 'w-60'] },
          { align: 'left', widths: ['w-52'] },
          { align: 'right', widths: ['w-36', 'w-64'] },
          { align: 'left', widths: ['w-44', 'w-56'] },
        ].map((row, i) => (
          <div
            key={i}
            className={`flex gap-2 ${row.align === 'right' ? 'justify-end' : 'items-start'}`}
          >
            {row.align === 'left' && (
              <Skeleton className="h-8 w-8 rounded-full shrink-0 mt-1" />
            )}
            <div className="flex flex-col gap-1">
              {row.widths.map((w, j) => (
                <Skeleton key={j} className={`h-9 rounded-xl ${w}`} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="h-16 border-t px-4 flex items-center">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}
