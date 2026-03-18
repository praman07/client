import { Skeleton } from '@/shared/ui/primitives/skeleton'

/**
 * SettingsSkeleton
 * Form-style layout placeholder for project settings pages.
 */
export function SettingsSkeleton() {
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Section header */}
      <div className="space-y-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Form fields */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className={`h-10 w-full rounded-md`} />
        </div>
      ))}

      {/* Textarea */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>

      {/* Submit button area */}
      <div className="flex justify-end pt-2">
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  )
}
