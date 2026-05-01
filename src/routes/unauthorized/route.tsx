import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/unauthorized')({
  component: UnauthorizedPage,
})

function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-40 font-bold text-tertiary">403</span>
        <h1 className="text-24 font-semibold tracking-tight">Access Denied</h1>
        <p className="max-w-sm text-14 text-tertiary">
          You don't have permission to view this page. Contact your workspace
          admin if you think this is a mistake.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-14 font-medium text-on-color shadow hover:bg-primary/90"
      >
        Back to home
      </Link>
    </div>
  )
}
