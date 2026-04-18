import * as React from 'react'
import {
  Clock,
  Database,
  Megaphone,
  Rocket,
  Shield,
  Sparkles,
  Terminal,
  Users,
} from 'lucide-react'
import type { Project } from '../model/types'
import { formatDateRelative } from '@/shared/lib'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui'

const DEMO_LOGOS = [
  { icon: Terminal, color: 'bg-accent-subtle text-accent-primary' },
  { icon: Sparkles, color: 'bg-layer-2 text-accent-primary' },
  { icon: Database, color: 'bg-success-subtle text-success-primary' },
  { icon: Megaphone, color: 'bg-warning-subtle text-warning-primary' },
  { icon: Shield, color: 'bg-danger-subtle text-danger-primary' },
  { icon: Rocket, color: 'bg-layer-2 text-accent-primary' },
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

  const visibleMembers = project.members.slice(0, 2)
  const excessMembersCount = project.members.length - 2

  return (
    <Card
      className="hover:bg-layer-1-hover cursor-pointer transition-colors group/project-card h-full border border-subtle"
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
        <CardTitle className="text-18 line-clamp-1 text-primary">{project.name}</CardTitle>
        <CardDescription className="text-13 line-clamp-2 text-secondary">
          {project.description || 'No description provided'}
        </CardDescription>
      </CardHeader>

      <CardFooter className="border-t border-subtle justify-between text-11 text-tertiary w-full mt-auto">
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

