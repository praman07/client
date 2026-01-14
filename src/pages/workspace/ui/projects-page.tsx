import { Link } from '@tanstack/react-router'

interface ProjectsPageProps {
  workspaceSlug: string
}

export function ProjectsPage({ workspaceSlug }: ProjectsPageProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="grid grid-cols-3 gap-4">
        <Link
          to="/workspace/$workspaceSlug/project/$projectId"
          params={{ workspaceSlug, projectId: 'p-1' }}
          className="block p-6 border rounded-lg hover:shadow-md transition"
        >
          Project Alpha
        </Link>
        <Link
          to="/workspace/$workspaceSlug/project/$projectId"
          params={{ workspaceSlug, projectId: 'p-2' }}
          className="block p-6 border rounded-lg hover:shadow-md transition"
        >
          Project Beta
        </Link>
      </div>
    </div>
  )
}
