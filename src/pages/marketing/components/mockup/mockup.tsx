import { MockupNav } from './mockup-nav'
import { MockupTabs } from './mockup-tabs'
import { MockupChatSidebar } from './mockup-chat-sidebar'
import { MockupChatWindow } from './mockup-chat-window'

/**
 * AppMockup — Static replica of the /project/:slug (Chat tab) view.
 * Used as a product preview in the marketing hero section.
 * Uses aspect-16/10 so proportions stay correct at any container width.
 */
export function AppMockup() {
  return (
    <div className="flex aspect-16/10 w-full flex-col overflow-hidden rounded-xl border border-border/40 bg-background">
      {/* Top nav bar */}
      <MockupNav />

      {/* Project tabs */}
      <MockupTabs active="Chat" />

      {/* Content: sidebar + chat window side by side */}
      <div className="flex flex-1 overflow-hidden">
        <MockupChatSidebar />
        <MockupChatWindow />
      </div>
      
    </div>
  )
}
