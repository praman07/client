import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/project/$projectId')({
  component: ProjectBaseLayout,
})

function ProjectBaseLayout() {
  const { projectId } = Route.useParams()
  return (
    <>
      {/* Logic Layer: Project Context Provider would go here */}
      <Outlet />
    </>
  )
}
