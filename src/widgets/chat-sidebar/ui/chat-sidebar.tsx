import { DUMMY_CHANNELS, DUMMY_DMS } from '../lib/dummy-data'
import { ChannelList } from './channel-list'
import { DMList } from './dm-list'
import { CreateChannelModal } from '@/features/create-channel'
import { Sidebar, SidebarContent } from '@/shared/ui/primitives/sidebar'
import { Separator } from '@/shared/ui/primitives/separator'
import { ScrollArea } from '@/shared/ui'

export function ChatSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r inset-y-0 z-0 relative h-full"
    >
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col gap-2 p-2">
            <ChannelList channels={DUMMY_CHANNELS} />
            <Separator />
            <DMList items={DUMMY_DMS} />
          </div>
        </ScrollArea>
      </SidebarContent>
      <CreateChannelModal />
    </Sidebar>
  )
}
