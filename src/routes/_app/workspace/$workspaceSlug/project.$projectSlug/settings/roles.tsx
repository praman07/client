import { createFileRoute } from '@tanstack/react-router'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentProject } from '@/entities/project'
import { selectCurrentWorkspace } from '@/entities/workspace/model/selectors'
import { ProjectRolesList } from '@/widgets/project-roles-list'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug/settings/roles',
)({
  component: RolesSettingsPage,
})

function RolesSettingsPage() {
  const project = useAppSelector(selectCurrentProject)
  const workspace = useAppSelector(selectCurrentWorkspace)

  if (!project || !workspace) return null

  return <ProjectRolesList projectId={project.id} workspaceId={workspace.id} />
}
