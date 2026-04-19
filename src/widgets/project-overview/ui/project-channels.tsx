import React from 'react'
import { Hash } from 'lucide-react'
import { Link, useParams } from '@tanstack/react-router'
import { cn } from '@/shared/lib/utils'

interface Channel {
  id: string
  name: string
  topic?: string | null
  updatedAt: string
}

interface ProjectChannelsProps {
  channels: Array<Channel>
}

export const ProjectChannels: React.FC<ProjectChannelsProps> = ({ channels }) => {
  const { workspaceSlug, projectSlug } = useParams({ strict: false })

  if (channels.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-10 font-bold uppercase tracking-widest text-secondary mr-1">
        Channels
      </span>
      {channels.map((ch) => (
        <Link
          key={ch.id}
          to="/workspace/$workspaceSlug/project/$projectSlug/chat/$conversationId"
          params={{ workspaceSlug: workspaceSlug ?? '', projectSlug: projectSlug ?? '', conversationId: ch.id }}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded-full border text-12 font-medium transition-colors group min-w-0 max-w-full',
            'bg-layer-1 border-subtle hover:border-accent-strong hover:text-primary text-secondary',
          )}
        >
          <Hash className="h-3 w-3 shrink-0" />
          <span className="truncate">{ch.name}</span>
        </Link>
      ))}
    </div>
  )
}
