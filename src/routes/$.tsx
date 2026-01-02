import { NotFoundPage } from '@/shared/ui/not-found-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$')({
  component: () => <NotFoundPage />,
})
