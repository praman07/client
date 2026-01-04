import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/workspace/$workspaceSlug/_main/')({
  component: () => (
    <div className="text-2xl font-bold">
      This is from /workspace/$workspaceSlug/_main/index.tsx
    </div>
  ),
})
