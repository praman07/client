/**
 * BoardLoading — Full-width Kanban skeleton while useBoardData loads.
 * Shows 3 column skeletons, each with 3 card skeletons.
 *
 * @layer Widgets
 */
export function BoardLoading() {
  return (
    <div className="flex h-full gap-3 overflow-x-auto p-4">
      {[1, 2, 3].map((col) => (
        <div
          key={col}
          className="flex w-72 shrink-0 flex-col gap-2 rounded-lg border border-subtle bg-layer-1 p-3"
        >
          {/* Column header skeleton */}
          <div className="flex items-center gap-2 pb-1">
            <div className="h-4 w-4 animate-pulse-subtle rounded-full bg-layer-2" />
            <div className="h-4 w-24 animate-pulse-subtle rounded-md bg-layer-2" />
            <div className="ml-auto h-4 w-6 animate-pulse-subtle rounded-full bg-layer-2" />
          </div>
          {/* Card skeletons */}
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="space-y-2 rounded-md border border-subtle bg-surface-1 p-3"
            >
              <div className="h-3 w-3/4 animate-pulse-subtle rounded bg-layer-2" />
              <div className="h-3 w-1/2 animate-pulse-subtle rounded bg-layer-2" />
              <div className="flex gap-1 pt-1">
                <div className="h-4 w-12 animate-pulse-subtle rounded-full bg-layer-2" />
                <div className="h-4 w-16 animate-pulse-subtle rounded-full bg-layer-2" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
