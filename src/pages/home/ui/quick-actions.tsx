import { Folder, MessageCircle, FileText, UserPlus } from 'lucide-react'

export function QuickActions() {
  return (
    <section className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
      <button className="flex items-center gap-2 px-4 py-2.5 bg-layer-1 border border-subtle rounded-xl hover:bg-layer-1-hover hover:border-subtle-1 transition-colors duration-(--transition-expressive) shrink-0 group hardware-accelerated active:scale-[0.98]">
        <Folder className="text-primary size-5 group-hover:scale-110 transition-transform duration-(--transition-spring)" />
        <span className="text-13 font-medium">New Project</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-layer-1 border border-subtle rounded-xl hover:bg-layer-1-hover hover:border-subtle-1 transition-colors duration-(--transition-expressive) shrink-0 group hardware-accelerated active:scale-[0.98]">
        <MessageCircle className="text-primary size-5 group-hover:scale-110 transition-transform duration-(--transition-spring)" />
        <span className="text-13 font-medium">Start Chat</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-layer-1 border border-subtle rounded-xl hover:bg-layer-1-hover hover:border-subtle-1 transition-colors duration-(--transition-expressive) shrink-0 group hardware-accelerated active:scale-[0.98]">
        <FileText className="text-primary size-5 group-hover:scale-110 transition-transform duration-(--transition-spring)" />
        <span className="text-13 font-medium">Draft Doc</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-layer-1 border border-subtle rounded-xl hover:bg-layer-1-hover hover:border-subtle-1 transition-colors duration-(--transition-expressive) shrink-0 group hardware-accelerated active:scale-[0.98]">
        <UserPlus className="text-primary size-5 group-hover:scale-110 transition-transform duration-(--transition-spring)" />
        <span className="text-13 font-medium">Invite Team</span>
      </button>
    </section>
  )
}
