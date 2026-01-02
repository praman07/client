import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_marketing/')({
  component: () => <div className="p-10 text-center text-2xl">Landing Page</div>,
})
