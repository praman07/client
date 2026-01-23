import { useMemo } from 'react'
import { DUMMY_DMS } from '../lib/dummy-data'
import { mapChannelsToItems } from '../lib/map-channels-to-items'
import { ChannelList } from './channel-list'
import { DMList } from './dm-list'
import { CreateChannelModal } from '@/features/create-channel'
import { Sidebar, SidebarContent } from '@/shared/ui/primitives/sidebar'
import { Separator } from '@/shared/ui/primitives/separator'
import { ScrollArea } from '@/shared/ui'
import { useChannels } from '@/entities/channel'
import type { Channel } from '@/entities/channel'
import { Skeleton } from '@/shared/ui/primitives/skeleton'

export function ChatSidebar() {
  // Fetch channels directly
  const { data, isLoading } = useChannels()

  // Read channels from Query Data
  const channels = (data?.getUserChannels as Channel[]) || []

  const channelItems = useMemo(() => mapChannelsToItems(channels), [channels])

  return (
    <Sidebar
      collapsible="icon"
      className="border-r inset-y-0 z-0 relative h-full"
    >
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col gap-2 p-2">
            {isLoading ? (
              <ChannelListSkeleton />
            ) : (
              <ChannelList channels={channelItems} />
            )}
            <Separator />
            <DMList items={DUMMY_DMS} />
          </div>
        </ScrollArea>
      </SidebarContent>
      <CreateChannelModal />
    </Sidebar>
  )
}

function ChannelListSkeleton() {
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
