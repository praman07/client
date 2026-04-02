import { createFileRoute } from '@tanstack/react-router'
import { UserSettingsLayout } from '@/pages/user-settings'

export const Route = createFileRoute('/_app/user')({
  component: UserSettingsLayout,
})
