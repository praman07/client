import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArchiveIcon,
  HashtagIcon,
  LockKeyIcon,
} from '@hugeicons/core-free-icons'
import { Link, useParams } from '@tanstack/react-router'
import type { ChannelItem } from '../model/types'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/primitives/sidebar'

interface ArchivedChannelListProps {
  channels: Array<ChannelItem>
}

export function ArchivedChannelList({ channels }: ArchivedChannelListProps) {
  const { conversationId } = useParams({ strict: false })

  if (channels.length === 0) {
    return null
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <HugeiconsIcon icon={ArchiveIcon} className="mr-1.5" />
        Archived ({channels.length})
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {channels.map((channel) => (
            <SidebarMenuItem key={channel.id}>
              <SidebarMenuButton
                isActive={conversationId === channel.id}
                tooltip={channel.name}
                className="opacity-60 hover:opacity-80"
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
