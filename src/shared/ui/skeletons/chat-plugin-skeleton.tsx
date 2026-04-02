import { ChatSkeleton } from './chat-skeleton'
import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * ChatPluginSkeleton
 *
 * Layout-level skeleton for the /chat route.
 * Shown as `pendingComponent` while TanStack Router resolves the route
 * and the chat WS plugin + sidebar initialise.
 *
 * Mirrors the actual ChatLayout structure:
 *   - Left: 240px sidebar strip (conversation list placeholder)
 *   - Right: ChatSkeleton (message area placeholder)
 */
export function ChatPluginSkeleton() {
  return (
    <div className="h-full flex w-full overflow-hidden">
      {/* Sidebar strip — matches --sidebar-width: 240px */}
      <div className="w-[240px] border-r shrink-0 flex flex-col gap-2 p-3 bg-background">
        {/* Search / new chat button */}
        <Skeleton className="h-8 w-full rounded-md" />
        {/* Conversation list items */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 px-1 py-0.5">
            <Skeleton className="h-7 w-7 rounded-full shrink-0" />
            <div className="flex flex-col gap-1 flex-1">
              <Skeleton className={`h-3 ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`} />
              <Skeleton className="h-2.5 w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Main chat area */}
      <div className="flex-1 overflow-hidden">
        <ChatSkeleton />
      </div>
    </div>
  )
}
