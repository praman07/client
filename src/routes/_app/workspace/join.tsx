import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RouteError } from '@/shared/ui'
import { JoinWorkspacePage } from '@/pages/workspace'

const joinSearchSchema = z.object({
  token: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_app/workspace/join')({
  validateSearch: joinSearchSchema,
  loaderDeps: ({ search: { token } }) => ({ token }),
  loader: () => null,
  component: JoinRouteComponent,
  errorComponent: RouteError,
})

function JoinRouteComponent() {
  const { token } = Route.useSearch()
  return <JoinWorkspacePage token={token} />
}
