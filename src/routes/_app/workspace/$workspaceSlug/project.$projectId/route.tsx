import { Outlet, createFileRoute } from '@tanstack/react-router'
import { NavTabs } from '@/widgets/navigation/ui/nav-tabs'
import { PROJECT_TABS } from '@/shared/config/navigation'
import { ProjectSwitcher } from '@/widgets/navigation/ui/project-switcher'

export const Route = createFileRoute(
  '/_app/workspace/$workspaceSlug/project/$projectId',
)({
  component: ProjectBaseLayout,
  staticData: {
    breadcrumb: () => <ProjectSwitcher />,
  },
})

function ProjectBaseLayout() {
  Route.useParams()
  return (
    <>
      <div className="border-b bg-background px-6">
        <NavTabs items={PROJECT_TABS as any} from={Route.fullPath} />
      </div>
      {/* Logic Layer: Project Context Provider would go here */}
      <div className="p-6">
        <Outlet />
      </div>
    </>
  )
}
