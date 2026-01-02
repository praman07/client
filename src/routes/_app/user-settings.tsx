import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/user-settings')({
  component: () => <div className="p-10">User Profile Settings Placeholder</div>,
})
