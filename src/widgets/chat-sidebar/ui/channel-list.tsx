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
  const { conversationId } = useParams({ strict: false })
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
                isActive={conversationId === channel.id}
                tooltip={channel.name}
                render={
                  <Link
                    to="/workspace/$workspaceSlug/project/$projectSlug/chat/$conversationId"
                    params={(prev: any) => ({
                      ...prev,
                      conversationId: channel.id,
                    })}
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
