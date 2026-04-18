import { Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-layer-1 p-4">
      <div className="w-full max-w-md rounded-lg border border-subtle bg-layer-1 shadow-raised-100">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle className="size-6" />
            </EmptyMedia>
            <EmptyTitle>404 Not Found</EmptyTitle>
            <EmptyDescription>
              The page you are looking for does not exist or has been moved.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              to="/"
              className="inline-flex h-9 items-center justify-center rounded-md bg-accent-primary px-4 py-2 text-13 font-medium text-on-color shadow-raised-100 hover:bg-accent-primary-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-strong"
            >
              Go Back Home
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  )
}
