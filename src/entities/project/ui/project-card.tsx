import type { Project } from '../model/types'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/shared/ui'

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const visibleMembers = project.members.slice(0, 3)
  const excessMembersCount = project.members.length - 3

  return (
    <Card
      className="group/project-card h-full bg-layer-1 hover:bg-layer-1-hover border border-subtle rounded-lg shadow-raised-100 cursor-pointer transition-colors duration-100 active:scale-[0.99] hardware-accelerated"
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col h-full gap-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Avatar shape="square" className="size-8 rounded-md border border-subtle bg-layer-2 shrink-0">
            <AvatarImage src={project.logoUrl ?? undefined} alt={project.name} className="object-cover" />
            <AvatarFallback className="text-12 font-medium text-secondary">
              {project.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-14 font-semibold text-primary truncate">
              {project.name}
            </CardTitle>
          </div>
        </div>

        {/* Description */}
        <CardDescription className="text-13 text-secondary line-clamp-2 leading-relaxed flex-1 pt-1">
          {project.description || <span className="opacity-50">No description provided</span>}
        </CardDescription>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-subtle">
          {project.members.length > 0 ? (
            <>
              <AvatarGroup>
                {visibleMembers.map((member) => (
                  <Avatar key={member.userId} className="size-6">
                    <AvatarImage src={member.user.avatarUrl || ''} alt={member.user.fullName || 'User'} />
                    <AvatarFallback className="text-[10px] font-medium bg-layer-2 text-secondary">
                      {member.user.fullName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {excessMembersCount > 0 && <AvatarGroupCount />}
              </AvatarGroup>
              <span className="text-12 text-tertiary font-medium">
                {project.members.length} member{project.members.length !== 1 ? 's' : ''}
              </span>
            </>
          ) : (
            <span className="text-12 text-tertiary font-medium">No members yet</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

