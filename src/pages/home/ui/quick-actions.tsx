import { HugeiconsIcon } from '@hugeicons/react'
import { Folder01Icon, Chat01Icon, Note01Icon, UserAdd01Icon } from '@hugeicons/core-free-icons'

export function QuickActions() {
  return (
    <section className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
      <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl hover:bg-muted hover:border-muted-foreground/30 transition-colors duration-(--transition-expressive) shrink-0 group hardware-accelerated active:scale-[0.98]">
        <HugeiconsIcon icon={Folder01Icon} className="text-primary size-5 group-hover:scale-110 transition-transform duration-(--transition-spring)" />
        <span className="text-sm font-medium">New Project</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl hover:bg-muted hover:border-muted-foreground/30 transition-colors duration-(--transition-expressive) shrink-0 group hardware-accelerated active:scale-[0.98]">
        <HugeiconsIcon icon={Chat01Icon} className="text-primary size-5 group-hover:scale-110 transition-transform duration-(--transition-spring)" />
        <span className="text-sm font-medium">Start Chat</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl hover:bg-muted hover:border-muted-foreground/30 transition-colors duration-(--transition-expressive) shrink-0 group hardware-accelerated active:scale-[0.98]">
        <HugeiconsIcon icon={Note01Icon} className="text-primary size-5 group-hover:scale-110 transition-transform duration-(--transition-spring)" />
        <span className="text-sm font-medium">Draft Doc</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl hover:bg-muted hover:border-muted-foreground/30 transition-colors duration-(--transition-expressive) shrink-0 group hardware-accelerated active:scale-[0.98]">
        <HugeiconsIcon icon={UserAdd01Icon} className="text-primary size-5 group-hover:scale-110 transition-transform duration-(--transition-spring)" />
        <span className="text-sm font-medium">Invite Team</span>
      </button>
    </section>
  )
}
