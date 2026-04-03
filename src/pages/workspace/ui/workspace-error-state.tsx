
export function WorkspaceErrorState() {
  return (
    <div className="flex bg-background h-screen w-full flex-col items-center justify-center gap-2">
      <h1 className="text-xl font-semibold tracking-tight">
        Workspace not found
      </h1>
      <p className="text-muted-foreground text-sm">
        The workspace you are looking for does not exist or you do not have
        permission to view it.
      </p>
    </div>
  )
}
