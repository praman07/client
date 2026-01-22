import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupAction,
} from '@/shared/ui/primitives/sidebar'
import { DMItem } from '../model/types'
import { Link, useParams } from '@tanstack/react-router'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'

interface DMListProps {
  items: DMItem[]
}

export function DMList({ items }: DMListProps) {
  const { channelId } = useParams({ strict: false }) as { channelId?: string }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
      <SidebarGroupAction title="New Message">
        <HugeiconsIcon icon={PlusSignIcon} />
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((dm) => (
            <SidebarMenuItem key={dm.id}>
              <SidebarMenuButton
                isActive={channelId === dm.id}
                tooltip={dm.name}
                render={
                  <Link
                    to="/workspace/$workspaceSlug/project/$projectSlug/chat/$channelId"
                    params={(prev: any) => ({ ...prev, channelId: dm.id })}
                  />
                }
              >
                <div className="relative flex items-center justify-center">
                  <Avatar className="h-6 w-6 rounded-md">
                    <AvatarImage src={dm.avatarUrl} alt={dm.name} />
                    <AvatarFallback className="rounded-md text-[10px]">
                      {dm.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background ${
                      dm.status === 'online'
                        ? 'bg-green-500'
                        : dm.status === 'away'
                          ? 'bg-yellow-500'
                          : 'bg-zinc-500'
                    }`}
                  />
                </div>
                <span>{dm.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
