import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/sign-up')({
  component: () => <div className="text-center">Sign Up Form Placeholder</div>,
})
