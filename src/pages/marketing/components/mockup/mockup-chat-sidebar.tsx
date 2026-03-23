import { Hash, Lock, MessageSquare, Plus } from 'lucide-react'

const channels = [
  { name: 'general', unread: true, active: true },
  { name: 'design', unread: false, active: false },
  { name: 'backend', unread: false, active: false },
  { name: 'announcements', unread: false, active: false, private: true },
]

const dms = [
  { initials: 'AL', name: 'Alex Liu', online: true, color: 'bg-blue-500/20 text-blue-400' },
  { initials: 'MK', name: 'Maria K.', online: true, color: 'bg-rose-500/20 text-rose-400' },
  { initials: 'SB', name: 'Sam B.', online: false, color: 'bg-amber-500/20 text-amber-400' },
]

export function MockupChatSidebar() {
  return (
    <div className="flex w-44 shrink-0 flex-col gap-3 border-r border-border/60 bg-background p-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Channels */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Channels
          </span>
          <Plus className="h-3 w-3 text-muted-foreground" />
        </div>

        {channels.map((ch) => (
          <div
            key={ch.name}
            className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] transition-colors ${
              ch.active
                ? 'bg-accent text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {ch.private ? (
              <Lock className="h-3 w-3 shrink-0" />
            ) : (
              <Hash className="h-3 w-3 shrink-0" />
            )}
            <span className="truncate">{ch.name}</span>
            {ch.unread && (
              <div className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-2 h-px bg-border/40" />

      {/* DMs */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Direct Messages
          </span>
          <MessageSquare className="h-3 w-3 text-muted-foreground" />
        </div>

        {dms.map((dm) => (
          <div
            key={dm.name}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="relative shrink-0">
              <div className={`flex h-4 w-4 items-center justify-center rounded-full text-[7px] font-bold ${dm.color}`}>
                {dm.initials}
              </div>
              <div className={`absolute -bottom-px -right-px h-1.5 w-1.5 rounded-full border border-background ${dm.online ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
            </div>
            <span className="truncate">{dm.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
