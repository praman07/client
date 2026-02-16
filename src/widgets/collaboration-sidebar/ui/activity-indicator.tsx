interface ActivityIndicatorProps {
  isActive: boolean
}

export function ActivityIndicator({ isActive }: ActivityIndicatorProps) {
  if (!isActive) {
    return (
      <div
        className="h-2 w-2 rounded-full bg-muted-foreground/30"
        title="Inactive"
      />
    )
  }

  return (
    <div className="relative h-2 w-2" title="Active">
      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
      <div className="relative h-2 w-2 rounded-full bg-green-500" />
    </div>
  )
}
