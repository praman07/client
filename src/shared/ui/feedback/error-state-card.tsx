import { AlertCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/shared/ui/primitives'

interface ErrorStateCardProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function ErrorStateCard({
  icon: Icon = AlertCircle,
  title,
  description,
  action,
  className,
}: ErrorStateCardProps) {
  return (
    <Card
      className={cn(
        'w-full max-w-md border-danger-strong/20 shadow-raised-100',
        className,
      )}
    >
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-subtle ring-4 ring-danger-subtle/5">
          <Icon className="h-6 w-6 text-danger-primary" />
        </div>
        <h3 className="text-18 font-semibold tracking-tight">{title}</h3>
      </CardHeader>
      <CardContent className="text-center pb-6">
        <p className="text-13 text-secondary leading-relaxed max-w-[90%] mx-auto">
          {description}
        </p>
      </CardContent>
      {action && (
        <CardFooter className="flex justify-center pb-6">{action}</CardFooter>
      )}
    </Card>
  )
}
