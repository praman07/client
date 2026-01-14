import { createFileRoute } from '@tanstack/react-router'
import { CreateWorkspacePage } from '@/pages/workspace'

export const Route = createFileRoute('/_app/workspace/new')({
  component: CreateWorkspacePage,
})
