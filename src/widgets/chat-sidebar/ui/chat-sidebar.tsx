import { useMemo } from 'react'
import {
  mapConversationsToItems,
  mapDmsToItems,
  mapGroupsToItems,
} from '../lib/map-channels-to-items'
import { ChannelList } from './channel-list'
import { DMList } from './dm-list'
import type { DMItem, GroupItem } from '../model/types'
import type { Conversation } from '@/entities/conversation'
import { CreateChannelModal } from '@/features/chat/create-channel'
import { Sidebar, SidebarContent } from '@/shared/ui/primitives/sidebar'
import { Separator } from '@/shared/ui/primitives/separator'
import { ScrollArea } from '@/shared/ui'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import {
  ConversationType,
  sortConversations,
  useUserConversations,
} from '@/entities/conversation'
/**
 * Chat Sidebar
 * Displays channels, DMs, and group conversations
 */
export function ChatSidebar() {
  // ──────────────────────────────────────────────────────────────────────────
  // Fetch all conversation types
  // ──────────────────────────────────────────────────────────────────────────

  // Fetch channels
  const { data: channelsData, isLoading: channelsLoading } =
    useUserConversations({
      type: ConversationType.Channel,
    })

  // Fetch DMs
  const { data: dmsData, isLoading: dmsLoading } = useUserConversations({
    type: ConversationType.Dm,
  })

  // Fetch group DMs
  const { data: groupsData, isLoading: groupsLoading } = useUserConversations({
    type: ConversationType.GroupDm,
  })

  // ──────────────────────────────────────────────────────────────────────────
  // Extract conversations from query data
  // ──────────────────────────────────────────────────────────────────────────

  const channels = useMemo(() => {
    const edges = channelsData?.getUserConversations?.edges || []
    return sortConversations(edges as Array<Conversation>)
  }, [channelsData])

  const dms = useMemo(() => {
    const edges = dmsData?.getUserConversations?.edges || []
    return sortConversations(edges as Array<Conversation>)
  }, [dmsData])

  const groups = useMemo(() => {
    const edges = groupsData?.getUserConversations?.edges || []
    return sortConversations(edges as Array<Conversation>)
  }, [groupsData])

  // ──────────────────────────────────────────────────────────────────────────
  // Map to sidebar item format using helper functions
  // ──────────────────────────────────────────────────────────────────────────

  const channelItems = useMemo(
    () => mapConversationsToItems(channels),
    [channels],
  )

  const dmItems = useMemo(() => mapDmsToItems(dms), [dms])

  const groupItems = useMemo(() => mapGroupsToItems(groups), [groups])

  // Combined DMs and groups for DMList component
  const allDMs = useMemo<Array<DMItem | GroupItem>>(
    () => [...dmItems, ...groupItems],
    [dmItems, groupItems],
  )

  const isLoading = channelsLoading || dmsLoading || groupsLoading

  return (
    <Sidebar
      collapsible="icon"
      className="border-r inset-y-0 z-0 relative h-full"
    >
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col gap-2 p-2">
            {isLoading ? (
              <ConversationListSkeleton />
            ) : (
              <>
                <ChannelList channels={channelItems} />
                <Separator />
                <DMList items={allDMs} />
              </>
            )}
          </div>
        </ScrollArea>
      </SidebarContent>
      <CreateChannelModal />
    </Sidebar>
  )
}

function ConversationListSkeleton() {
  return (
    <div className="flex flex-col gap-1 px-2 py-2">
      <div className="flex items-center justify-between px-2 py-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1.5">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
}
