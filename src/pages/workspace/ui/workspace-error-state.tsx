
export function WorkspaceErrorState() {
  return (
    <div className="flex bg-surface-1 h-screen w-full flex-col items-center justify-center gap-2">
      <h1 className="text-18 font-semibold tracking-tight text-primary">
        Workspace not found
      </h1>
      <p className="text-secondary text-13">
        The workspace you are looking for does not exist or you do not have
        permission to view it.
      </p>
    </div>
  )
}
