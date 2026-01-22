import { Outlet, createFileRoute } from '@tanstack/react-router'
import { NavTabs, ProjectSwitcher } from '@/widgets/navigation'
import { PROJECT_TABS } from '@/shared/config/navigation'
import { useAppSelector } from '@/shared/hooks'
import { selectWorkspaceBySlug } from '@/entities/workspace/model/selectors'
import { useProjectBySlug } from '@/entities/project/hooks'
import { useFragment } from '@/gql'
import { PROJECT_FRAGMENT } from '@/entities/project/api/fragments'
import {
  ProjectErrorState,
  ProjectLoadingState,
} from '@/entities/project/ui/layout-states'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectSlug',
)({
  component: ProjectBaseLayout,
  staticData: {
    breadcrumb: () => <ProjectSwitcher />,
  },
})

function ProjectBaseLayout() {
  const params = Route.useParams()
  const { workspaceSlug, projectSlug } = params

  // 1. Get Workspace ID (Parent Layout should have synced it)
  const workspace = useAppSelector((state) =>
    selectWorkspaceBySlug(state, workspaceSlug),
  )

  // 2. Fetch Project
  const { data, isLoading, error } = useProjectBySlug(
    workspace?.id || '',
    projectSlug,
  )
  const project = useFragment(PROJECT_FRAGMENT, data?.projectBySlug)

  // 3. Loading State
  if (isLoading || (!workspace && !error)) {
    return <ProjectLoadingState />
  }

  // 4. Error/Not Found State
  if (error || !project) {
    return <ProjectErrorState workspaceSlug={workspaceSlug} />
  }

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b bg-background px-6">
        <NavTabs items={PROJECT_TABS as any} from={Route.fullPath} />
      </div>
      {/* Logic Layer: Project Context Provider could go here */}
      <div className="flex-1 overflow-hidden relative">
        <Outlet />
      </div>
    </div>
  )
}
