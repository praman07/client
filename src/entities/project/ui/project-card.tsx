import * as React from 'react'
import {
  Users,
  Clock,
  Terminal,
  Sparkles,
  Database,
  Megaphone,
  Shield,
  Rocket,
} from 'lucide-react'
import type { Project } from '../model/types'
import { formatDateRelative } from '@/shared/lib'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from '@/shared/ui'

// Custom Logo generation based on project ID
const DEMO_LOGOS = [
  { icon: Terminal, color: 'bg-blue-500/10 text-blue-500' },
  { icon: Sparkles, color: 'bg-purple-500/10 text-purple-500' },
  { icon: Database, color: 'bg-emerald-500/10 text-emerald-500' },
  { icon: Megaphone, color: 'bg-orange-500/10 text-orange-500' },
  { icon: Shield, color: 'bg-red-500/10 text-red-500' },
  { icon: Rocket, color: 'bg-pink-500/10 text-pink-500' },
]

function getDemoLogo(projectId: string) {
  let hash = 0
  for (let i = 0; i < projectId.length; i++) {
    hash = projectId.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % DEMO_LOGOS.length
  return DEMO_LOGOS[index]
}

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const LogoConfig = React.useMemo(() => getDemoLogo(project.id), [project.id])
  const LogoIcon = LogoConfig.icon

  // Only take first 2 members for avatar stack
  const visibleMembers = project.members.slice(0, 2)
  const excessMembersCount = project.members.length - 2

  return (
    <Card
      className="hover:bg-muted/50 cursor-pointer transition-colors group/project-card h-full"
      onClick={onClick}
    >
      <div className="flex justify-between items-start px-6">
        <div
          className={`flex items-center justify-center size-10 rounded-lg ${LogoConfig.color}`}
        >
          <LogoIcon className="w-5 h-5" />
        </div>
        
        {project.members.length > 0 && (
          <AvatarGroup>
            {visibleMembers.map((member) => (
              <Avatar key={member.userId}>
                <AvatarImage src={member.user.avatarUrl || ''} alt={member.user.fullName || 'User'} />
                <AvatarFallback>
                  {member.user.fullName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            ))}
            {excessMembersCount > 0 && (
              <AvatarGroupCount>{excessMembersCount}+</AvatarGroupCount>
            )}
          </AvatarGroup>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description || 'No description provided'}
        </CardDescription>
      </CardHeader>

      <CardFooter className="border-t border-border/10 justify-between text-xs text-muted-foreground w-full mt-auto">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{project.members.length} member{project.members.length === 1 ? '' : 's'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{formatDateRelative(project.createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

