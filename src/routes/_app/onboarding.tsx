import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/onboarding')({
  component: () => <div className="p-10">Workspace Wizard Placeholder</div>,
})
