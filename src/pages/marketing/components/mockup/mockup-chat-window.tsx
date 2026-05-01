import { Hash, MoreHorizontal, Paperclip, Send, Smile } from 'lucide-react'

interface MockMessage {
  id: string
  initials: string
  name: string
  time: string
  text: string
  color: string
  isCode?: boolean
}

const messages: Array<MockMessage> = [
  {
    id: '1',
    initials: 'AL',
    name: 'Alex Liu',
    time: '10:28 AM',
    text: "Pushed the redesign to staging. Can someone do a quick review before we merge? 🚀",
    color: 'bg-accent-primary500/20 text-accent-primary400',
  },
  {
    id: '2',
    initials: 'MK',
    name: 'Maria K.',
    time: '10:29 AM',
    text: "Looks clean! Left a couple comments on the nav component. One thing — the mobile breakpoint at 768px feels tight.",
    color: 'bg-danger-subtle500/20 text-danger-primary400',
  },
  {
    id: '3',
    initials: 'AL',
    name: 'Alex Liu',
    time: '10:30 AM',
    text: "Good catch, bumping it to 820px. Here's the diff:",
    color: 'bg-accent-primary500/20 text-accent-primary400',
    isCode: true,
  },
  {
    id: '4',
    initials: 'SB',
    name: 'Sam B.',
    time: '10:31 AM',
    text: "LGTM! Perf budget is still green too — bundle stayed under 120kb. Merging. ✅",
    color: 'bg-warning-subtle500/20 text-warning-primary400',
  },
  {
    id: '5',
    initials: 'JD',
    name: 'You',
    time: '10:33 AM',
    text: "Nice work team. Closing the sprint ticket and tagging the release.",
    color: 'bg-success-subtle500/20 text-success-primary400',
  },
]

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${color}`}>
      {initials}
    </div>
  )
}

function MessageRow({ msg }: { msg: MockMessage }) {
  return (
    <div className="group flex items-start gap-2 rounded-md px-3 py-1.5 hover:bg-accent/40 transition-colors">
      <Avatar initials={msg.initials} color={msg.color} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] font-semibold text-primary">{msg.name}</span>
          <span className="text-[9px] text-tertiary">{msg.time}</span>
        </div>
        {msg.isCode ? (
          <>
            <p className="text-[10px] leading-relaxed text-primary/80">{msg.text}</p>
            <div className="mt-1 rounded-md border border-border/50 bg-layer-900/80 px-2.5 py-1.5 font-mono text-[9px] text-success-primary400/90">
              <span className="text-danger-primary400">-</span> breakpoint: 768px<br />
              <span className="text-success-primary400">+</span> breakpoint: 820px
            </div>
          </>
        ) : (
          <p className="text-[10px] leading-relaxed text-primary/80">{msg.text}</p>
        )}
      </div>
      <button className="invisible group-hover:visible shrink-0 text-tertiary hover:text-primary">
        <MoreHorizontal className="h-3 w-3" />
      </button>
    </div>
  )
}

export function MockupChatWindow() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      {/* Channel header */}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border/60 px-4">
        <Hash className="h-3.5 w-3.5 text-tertiary" />
        <span className="text-14 font-semibold text-primary">general</span>
        <div className="mx-2 h-4 w-px bg-border/60" />
        <span className="text-[10px] text-tertiary truncate">
          General discussion about the project
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {/* Sync status dot */}
          <div className="h-1.5 w-1.5 rounded-full bg-success-subtle500" />
          <span className="text-[9px] text-tertiary">Live</span>
        </div>
      </div>

      {/* Message list */}
      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {messages.map((msg) => (
          <MessageRow key={msg.id} msg={msg} />
        ))}
      </div>

      {/* Message input */}
      <div className="shrink-0 border-t border-border/60 p-3">
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-accent/30 px-3 py-2">
          <span className="flex-1 text-[10px] text-tertiary select-none">
            Message <span className="font-medium">#general</span>...
          </span>
          <div className="flex items-center gap-1.5 text-tertiary">
            <Paperclip className="h-3 w-3" />
            <Smile className="h-3 w-3" />
            <button className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-on-color">
              <Send className="h-2.5 w-2.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
