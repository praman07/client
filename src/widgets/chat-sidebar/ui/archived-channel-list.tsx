import { Archive, Hash, Lock } from 'lucide-react'
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
      <SidebarGroupLabel className="flex items-center gap-1.5">
        <Archive className="size-3.5" />
        Archived ({channels.length})
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {channels.map((channel) => (
            <SidebarMenuItem key={channel.id}>
              <SidebarMenuButton
                isActive={conversationId === channel.id}
                tooltip={channel.name}
                className="text-tertiary hover:text-secondary"
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
                {channel.type === 'private' ? (
                  <Lock className="size-4 shrink-0" />
                ) : (
                  <Hash className="size-4 shrink-0" />
                )}
                <span>{channel.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
