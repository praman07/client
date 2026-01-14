import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '@/pages/workspace'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/_main/')({
  component: DashboardPage,
})
