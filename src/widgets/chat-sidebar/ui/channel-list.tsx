import { HugeiconsIcon } from '@hugeicons/react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupAction,
} from '@/shared/ui/primitives/sidebar'
import { HashtagIcon, LockKeyIcon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { ChannelItem } from '../model/types'
import { Link, useParams } from '@tanstack/react-router'

interface ChannelListProps {
  channels: ChannelItem[]
}

export function ChannelList({ channels }: ChannelListProps) {
  const { channelId } = useParams({ strict: false }) as { channelId?: string }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Channels</SidebarGroupLabel>
      <SidebarGroupAction title="Create Channel">
        <HugeiconsIcon icon={PlusSignIcon} />
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {channels.map((channel) => (
            <SidebarMenuItem key={channel.id}>
              <SidebarMenuButton
                isActive={channelId === channel.id}
                tooltip={channel.name}
                render={
                  <Link
                    to="/workspace/$workspaceSlug/project/$projectSlug/chat/$channelId"
                    params={(prev: any) => ({ ...prev, channelId: channel.id })}
                  />
                }
              >
                <HugeiconsIcon
                  icon={channel.type === 'private' ? LockKeyIcon : HashtagIcon}
                />
                <span>{channel.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
