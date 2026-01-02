import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/sign-in')({
  component: () => <div className="text-center">Sign In Form Placeholder</div>,
})
