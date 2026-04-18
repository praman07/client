import { useMemo } from 'react'
import {
  mapConversationsToItems,
  mapDmsToItems,
  mapGroupsToItems,
} from '../lib/map-channels-to-items'
import { ChannelList } from './channel-list'
import { ArchivedChannelList } from './archived-channel-list'
import { DMList } from './dm-list'
import type { DMItem, GroupItem } from '../model/types'
import type { Conversation } from '@/entities/conversation'
import { CreateChannelModal } from '@/features/chat/create-channel'
import { useGetProjectDms } from '@/features/chat/get-project-dms'
import { Sidebar, SidebarContent } from '@/shared/ui/primitives/sidebar'
import { Separator } from '@/shared/ui/primitives/separator'
import { ScrollArea } from '@/shared/ui'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import {
  ConversationType,
  sortConversations,
  useUserConversations,
} from '@/entities/conversation'
import { createLogger } from '@/shared/lib/logger'

const log = createLogger('chat:sidebar')
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

  // Fetch archived channels
  const { data: archivedChannelsData, isLoading: archivedChannelsLoading } =
    useUserConversations({
      type: ConversationType.Channel,
      includeArchived: true,
    })

  // Fetch DMs — uses getProjectDms which returns the other user's profile
  const { data: dmsData, isLoading: dmsLoading } = useGetProjectDms()

  // Fetch group DMs
  const { data: groupsData, isLoading: groupsLoading } = useUserConversations({
    type: ConversationType.GroupDm,
  })

  // ──────────────────────────────────────────────────────────────────────────
  // Extract conversations from query data
  // ──────────────────────────────────────────────────────────────────────────

  const channels = useMemo(() => {
    const edges = channelsData?.getUserConversations.edges ?? []
    const allChannels = sortConversations(edges as Array<Conversation>)
    // Filter out archived channels from active channels list
    return allChannels.filter((channel) => !channel.isArchived)
  }, [channelsData])

  const archivedChannels = useMemo(() => {
    const edges = archivedChannelsData?.getUserConversations.edges ?? []
    const allChannels = sortConversations(edges as Array<Conversation>)
    // Filter to only show archived channels
    const filtered = allChannels.filter((channel) => channel.isArchived)

    // Debug logging
    log.debug('Archived Channels Data Flow', {
      totalEdges: edges.length,
      allChannelsCount: allChannels.length,
      filteredArchivedCount: filtered.length,
      archivedChannels: filtered.map((c) => ({
        id: c.id,
        name: c.name,
        isArchived: c.isArchived,
        deletedAt: c.deletedAt,
      })),
    })

    return filtered
  }, [archivedChannelsData])

  const groups = useMemo(() => {
    const edges = groupsData?.getUserConversations.edges ?? []
    return sortConversations(edges as Array<Conversation>)
  }, [groupsData])

  // ──────────────────────────────────────────────────────────────────────────
  // Map to sidebar item format using helper functions
  // ──────────────────────────────────────────────────────────────────────────

  const channelItems = useMemo(
    () => mapConversationsToItems(channels),
    [channels],
  )

  const archivedChannelItems = useMemo(
    () => mapConversationsToItems(archivedChannels),
    [archivedChannels],
  )

  const dmItems = useMemo(
    () => mapDmsToItems(dmsData?.getProjectDms ?? []),
    [dmsData],
  )

  const groupItems = useMemo(() => mapGroupsToItems(groups), [groups])

  // Combined DMs and groups for DMList component
  const allDMs = useMemo<Array<DMItem | GroupItem>>(
    () => [...dmItems, ...groupItems],
    [dmItems, groupItems],
  )

  const isLoading =
    channelsLoading || archivedChannelsLoading || dmsLoading || groupsLoading

  return (
    <Sidebar
      collapsible="icon"
      className="border-r inset-y-0 z-0 relative h-full"
    >
      <SidebarContent className="overflow-hidden bg-layer-1">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col gap-2 p-2">
            {isLoading ? (
              <ConversationListSkeleton />
            ) : (
              <>
                <ChannelList channels={channelItems} />
                {archivedChannelItems.length > 0 && (
                  <ArchivedChannelList channels={archivedChannelItems} />
                )}
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
