import { HugeiconsIcon } from '@hugeicons/react'
import {
  HashtagIcon,
  LockKeyIcon,
  PlusSignIcon,
} from '@hugeicons/core-free-icons'
import { Link, useParams } from '@tanstack/react-router'
import type { ChannelItem } from '../model/types'
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/primitives/sidebar'
import { useCreateChannelModal } from '@/features/chat/create-channel'

interface ChannelListProps {
  channels: Array<ChannelItem>
}

export function ChannelList({ channels }: ChannelListProps) {
  const { channelId } = useParams({ strict: false })
  const { open } = useCreateChannelModal()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Channels</SidebarGroupLabel>
      <SidebarGroupAction title="Create Channel" onClick={open}>
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
