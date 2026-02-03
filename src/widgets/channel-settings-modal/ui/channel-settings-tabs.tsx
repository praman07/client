import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/primitives/tabs'
import { ScrollArea } from '@/shared/ui/primitives/scroll-area'
import { AboutTab } from './about-tab'
import { MembersTab } from './members-tab'
import { SettingsTab } from './settings-tab'
import { useChannelSettings } from '../hooks'
import { ChannelSettingsTab } from '../model/types'
import type { ConversationFieldsFragment } from '@/gql/graphql'

interface ChannelSettingsTabsProps {
  conversation: ConversationFieldsFragment
}

export function ChannelSettingsTabs({
  conversation,
}: ChannelSettingsTabsProps) {
  const { activeTab, setTab } = useChannelSettings()

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setTab(value as ChannelSettingsTab)}
      className="h-full flex flex-col"
    >
      <TabsList className="w-full grid grid-cols-3 shrink-0">
        <TabsTrigger value={ChannelSettingsTab.ABOUT}>About</TabsTrigger>
        <TabsTrigger value={ChannelSettingsTab.MEMBERS}>Members</TabsTrigger>
        <TabsTrigger value={ChannelSettingsTab.SETTINGS}>Settings</TabsTrigger>
      </TabsList>

      <div className="flex-1 mt-4 overflow-hidden">
        <TabsContent value={ChannelSettingsTab.ABOUT} className="h-full mt-0">
          <ScrollArea className="h-full pr-4">
            <AboutTab conversation={conversation} />
          </ScrollArea>
        </TabsContent>
        <TabsContent value={ChannelSettingsTab.MEMBERS} className="h-full mt-0">
          <ScrollArea className="h-full pr-4">
            <MembersTab conversation={conversation} />
          </ScrollArea>
        </TabsContent>
        <TabsContent
          value={ChannelSettingsTab.SETTINGS}
          className="h-full mt-0"
        >
          <ScrollArea className="h-full pr-4">
            <SettingsTab conversation={conversation} />
          </ScrollArea>
        </TabsContent>
      </div>
    </Tabs>
  )
}
