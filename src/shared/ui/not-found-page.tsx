import { Link } from '@tanstack/react-router'
import { AlertCircle } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './empty'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-lg border bg-card shadow-sm">
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
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Go Back Home
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  )
}
