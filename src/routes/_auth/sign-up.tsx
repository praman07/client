import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { AuthSignupPage } from '@/widgets/auth/sign-up-page'

const checklistSearchSchema = z.object({
  redirect_url: z.string().optional(),
})

export const Route = createFileRoute('/_auth/sign-up')({
  validateSearch: checklistSearchSchema,
  component: SignUpRouteComponent,
})

function SignUpRouteComponent() {
  const search = Route.useSearch()
  return <AuthSignupPage redirectUrl={search.redirect_url} />
}
