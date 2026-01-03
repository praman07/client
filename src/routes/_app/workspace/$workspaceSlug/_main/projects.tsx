import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/_main/projects')({
  component: ProjectsRegistry,
})

function ProjectsRegistry() {
    const { workspaceSlug } = Route.useParams()
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Projects</h2>
            <div className="grid grid-cols-3 gap-4">
                <Link to="/workspace/$workspaceSlug/project/p-1" params={{ workspaceSlug }} className="block p-6 border rounded-lg hover:shadow-md transition">
                    Project Alpha
                </Link>
                <Link to="/workspace/$workspaceSlug/project/p-2" params={{ workspaceSlug }} className="block p-6 border rounded-lg hover:shadow-md transition">
                    Project Beta
                </Link>
            </div>
        </div>
    )
}
