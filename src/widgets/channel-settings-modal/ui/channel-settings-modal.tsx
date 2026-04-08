import { useChannelSettings } from '../hooks'
import { ChannelSettingsTab } from '../model/types'
import { AboutTab } from './about-tab'
import { MembersTab } from './members-tab'
import { SettingsTab } from './settings-tab'
import type { ConversationFieldsFragment } from '@/gql/graphql'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui'
import { useConversation } from '@/entities/conversation'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { cn } from '@/shared/lib/utils'

const TABS = [
  { value: ChannelSettingsTab.ABOUT, label: 'About' },
  { value: ChannelSettingsTab.MEMBERS, label: 'Members' },
  { value: ChannelSettingsTab.SETTINGS, label: 'Settings' },
] as const

export function ChannelSettingsModal() {
  const { isOpen, channelId, close, activeTab, setTab } = useChannelSettings()

  const { data, isLoading } = useConversation(channelId || '', {
    enabled: !!channelId && isOpen,
  })

  const conversation = data?.getConversation as ConversationFieldsFragment | undefined

  const tabs = TABS.map((t) =>
    t.value === ChannelSettingsTab.MEMBERS && conversation?.memberCount != null
      ? { ...t, badge: conversation.memberCount }
      : { ...t, badge: undefined },
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] h-[min(640px,90dvh)] flex flex-col p-0 gap-0 overflow-hidden bg-background border-border">

        {/* ── Header: title + tab bar ── */}
        <DialogHeader className="px-6 pt-5 pb-0 shrink-0 space-y-0">
          <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-1.5 pb-3">
            {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <>
                <span className="text-muted-foreground font-normal">#</span>
                <span>{conversation?.name ?? 'Channel Settings'}</span>
              </>
            )}
          </DialogTitle>

          {/* Tab bar — flush with header bottom border */}
          <nav
            role="tablist"
            aria-label="Channel settings tabs"
            className="flex items-end -mx-6 px-6 overflow-x-auto overflow-y-hidden scrollbar-none border-b border-border"
          >
            {isLoading ? (
              <div className="flex gap-6 pb-2.5">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-14" />
              </div>
            ) : (
              tabs.map((tab) => (
                <button
                  key={tab.value}
                  role="tab"
                  aria-selected={activeTab === tab.value}
                  onClick={() => setTab(tab.value)}
                  className={cn(
                    'shrink-0 pb-2.5 pt-1 mr-5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap focus-visible:outline-none',
                    activeTab === tab.value
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border/60',
                  )}
                >
                  {tab.label}
                  {tab.badge != null && (
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))
            )}
          </nav>
        </DialogHeader>

        {/* ── Scrollable content body ── */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {isLoading ? (
            <div className="px-6 py-5 space-y-3">
              <Skeleton className="h-28 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ) : (
            conversation && (
              <div className="px-6 py-5">
                {activeTab === ChannelSettingsTab.ABOUT && (
                  <AboutTab conversation={conversation} />
                )}
                {activeTab === ChannelSettingsTab.MEMBERS && (
                  <MembersTab conversation={conversation} />
                )}
                {activeTab === ChannelSettingsTab.SETTINGS && (
                  <SettingsTab conversation={conversation} />
                )}
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
