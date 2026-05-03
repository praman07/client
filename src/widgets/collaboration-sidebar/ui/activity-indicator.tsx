interface ActivityIndicatorProps {
  isActive: boolean
}

export function ActivityIndicator({ isActive }: ActivityIndicatorProps) {
  if (!isActive) {
    return (
      <div
        className="h-2 w-2 rounded-full bg-accent-primary/30"
        title="Inactive"
      />
    )
  }

  return (
    <div className="relative h-2 w-2" title="Active">
      <div className="absolute inset-0 rounded-full bg-success-subtle500 animate-pulse-subtle opacity-75" />
      <div className="relative h-2 w-2 rounded-full bg-success-subtle500" />
    </div>
  )
}
