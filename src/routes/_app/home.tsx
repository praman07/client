import { createFileRoute } from '@tanstack/react-router'
import { RouteError } from '@/shared/ui'
import { HomePage } from '@/pages/home'

export const Route = createFileRoute('/_app/home')({
  component: HomePage,
  errorComponent: RouteError,
})
