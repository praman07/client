import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/_main/settings/')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/workspace/$workspaceSlug/settings/general',
      params,
    })
  },
})
