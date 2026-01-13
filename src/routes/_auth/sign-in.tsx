import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { AuthSigninPage } from '@/widgets/auth/sign-in-page'

const checklistSearchSchema = z.object({
  redirect_url: z.string().optional(),
})

export const Route = createFileRoute('/_auth/sign-in')({
  validateSearch: checklistSearchSchema,
  component: SignInRouteComponent,
})

function SignInRouteComponent() {
  const search = Route.useSearch()
  return <AuthSigninPage redirectUrl={search.redirect_url} />
}
