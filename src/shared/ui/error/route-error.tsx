import { AlertTriangleIcon, RefreshCwIcon } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/primitives'

interface RouteErrorProps {
  error: unknown
  reset?: () => void
}

export function RouteError({ error, reset }: RouteErrorProps) {
  const router = useRouter()

  const handleRetry = () => {
    // Invalidate router cache to force reload data
    router.invalidate()
    // Call reset if provided (Tanstack router passes this)
    reset?.()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 animate-in fade-in zoom-in-95 duration-300">
      <Card className="w-full max-w-md shadow-raised-100 border-danger-strong">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-danger-subtle rounded-full">
              <AlertTriangleIcon className="w-8 h-8 text-danger-primary" />
            </div>
          </div>
          <CardTitle className="text-18">Something went wrong</CardTitle>
          <CardDescription>
            We encountered an unexpected error while loading this page.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-3 text-13 font-mono text-danger-primary bg-danger-subtle rounded-md border border-danger-strong overflow-auto max-h-32">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
          >
            Go Home
          </Button>
          <Button onClick={handleRetry} className="gap-2">
            <RefreshCwIcon className="w-4 h-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
