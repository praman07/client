import { createFileRoute } from '@tanstack/react-router'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { IssuesBoard } from '@/widgets/issues-board'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/kanban/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const project = useAppSelector(selectCurrentProject)

  // Project is always loaded by the parent route (project.$projectSlug/route.tsx)
  // before this component renders — the parent shows a loading state otherwise.
  if (!project) return null

  // Note: project.members only contains { userId, role, joinedAt } — no fullName.
  // Assignee picker will show empty until a dedicated getProjectMembers query is wired.
  // This is a known gap to be addressed in the members feature.
  const projectMembers = project.members.map((m) => ({
    id: m.userId,
    fullName: m.user.fullName ?? 'Unknown',
    avatarUrl: m.user.avatarUrl ?? undefined,
  }))

  return (
    <div className="h-full overflow-hidden">
      <IssuesBoard
        projectId={project.id}
        projectKey={project.key}
        projectMembers={projectMembers}
      />
    </div>
  )
}
