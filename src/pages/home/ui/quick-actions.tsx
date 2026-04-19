import { HugeiconsIcon } from '@hugeicons/react'
import { Chat01Icon, Folder01Icon, Note01Icon, UserAdd01Icon } from '@hugeicons/core-free-icons'

export function QuickActions() {
  return (
    <section className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
      <button className="flex items-center gap-2 px-4 py-2.5 bg-layer-1 border border-subtle rounded-xl hover:bg-layer-2 hover:border-subtle-1 transition-colors duration-(--transition-expressive) shrink-0 group hardware-accelerated active:scale-[0.98]">
        <HugeiconsIcon icon={Folder01Icon} className="text-primary size-5 group-hover:scale-110 transition-transform duration-(--transition-spring)" />
        <span className="text-13 font-medium">New Project</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-layer-1 border border-subtle rounded-xl hover:bg-layer-2 hover:border-subtle-1 transition-colors duration-(--transition-expressive) shrink-0 group hardware-accelerated active:scale-[0.98]">
        <HugeiconsIcon icon={Chat01Icon} className="text-primary size-5 group-hover:scale-110 transition-transform duration-(--transition-spring)" />
        <span className="text-13 font-medium">Start Chat</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-layer-1 border border-subtle rounded-xl hover:bg-layer-2 hover:border-subtle-1 transition-colors duration-(--transition-expressive) shrink-0 group hardware-accelerated active:scale-[0.98]">
        <HugeiconsIcon icon={Note01Icon} className="text-primary size-5 group-hover:scale-110 transition-transform duration-(--transition-spring)" />
        <span className="text-13 font-medium">Draft Doc</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-layer-1 border border-subtle rounded-xl hover:bg-layer-2 hover:border-subtle-1 transition-colors duration-(--transition-expressive) shrink-0 group hardware-accelerated active:scale-[0.98]">
        <HugeiconsIcon icon={UserAdd01Icon} className="text-primary size-5 group-hover:scale-110 transition-transform duration-(--transition-spring)" />
        <span className="text-13 font-medium">Invite Team</span>
      </button>
    </section>
  )
}
