import { ChevronsUpDown, Layers } from 'lucide-react'

export function MockupNav() {
  return (
    <div className="flex h-11 shrink-0 items-center gap-1 border-b border-border/60 bg-background px-3">
      {/* Logo mark */}
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] font-black text-primary-foreground select-none mr-1">
        C
      </div>

      {/* Workspace switcher */}
      <button className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
        <div className="flex h-4 w-4 items-center justify-center rounded bg-violet-500/15 text-violet-400">
          <span className="text-[8px] font-bold">A</span>
        </div>
        <span className="text-foreground">Acme Corp</span>
        <ChevronsUpDown className="h-3 w-3 opacity-50" />
      </button>

      <span className="text-border/60 select-none">/</span>

      {/* Project switcher */}
      <button className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
        <div className="flex h-4 w-4 items-center justify-center rounded bg-indigo-500/15 text-indigo-400">
          <Layers className="h-2.5 w-2.5" />
        </div>
        <span className="text-foreground">Frontend</span>
        <ChevronsUpDown className="h-3 w-3 opacity-50" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User avatar */}
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-[9px] font-bold text-emerald-400 select-none">
        JD
      </div>
    </div>
  )
}
