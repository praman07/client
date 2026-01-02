import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/_main/members')({
  component: () => <div className="text-xl">Team Management</div>,
})
