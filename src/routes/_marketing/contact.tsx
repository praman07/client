import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_marketing/contact')({
  component: () => <div className="p-10 text-center text-2xl">Contact Us</div>,
})
