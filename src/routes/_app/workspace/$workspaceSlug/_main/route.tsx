import { Outlet, createFileRoute } from '@tanstack/react-router'
import { WORKSPACE_TABS } from '@/shared/config/navigation'
import { NavTabs } from '@/widgets/navigation'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/_main')({
  component: WorkspaceMainLayout,
})

function WorkspaceMainLayout() {
  return (
    <>
      <div className="border-b bg-background px-6">
        <NavTabs items={WORKSPACE_TABS as any} from={Route.fullPath} />
      </div>
      <main className="flex-1 overflow-auto bg-background p-6">
        <Outlet />
      </main>
    </>
  )
}
