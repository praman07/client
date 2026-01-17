import { Users } from 'lucide-react'
import type { Project } from '../model/types'
import { formatDate } from '@/shared/lib'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui'

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card
      className="hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <div className="flex items-center text-muted-foreground text-sm">
            <Users className="w-4 h-4 mr-1" />
            <span>{project.members.length}</span>
          </div>
        </div>
        <CardDescription className="line-clamp-2 h-10">
          {project.description || 'No description provided'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          Created {formatDate(project.createdAt)}
        </div>
      </CardContent>
    </Card>
  )
}
