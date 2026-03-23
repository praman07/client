import { cn } from '@/shared/lib/utils'

// ── Collabify-adapted content ────────────────────────────────────────────────

const cardContents = [
  {
    title: 'Real-time Chat',
    description:
      'Channels, threads, DMs, and typing indicators — all under 16ms via WebSocket. Replace Slack without switching tabs.',
  },
  {
    title: 'Live Collaboration',
    description:
      'Pages with live cursors and simultaneous editing. See who\'s typing, where, and what — like Google Docs but built into your project.',
  },
  {
    title: 'Issue Tracking',
    description:
      'Kanban boards, custom statuses, priorities, labels, and S3 file attachments on every issue. Replace Jira with a tool that actually talks to your chat and docs. No more copy-pasting links across five different tabs just to give someone context on a ticket.',
  },
  {
    title: 'Vault Storage',
    description:
      'S3-backed file storage with nested folders, role-based access, and pre-signed URLs. Replace Google Drive.',
  },
  {
    title: 'One Flat Price',
    description:
      'Charged to the workspace owner — not per seat. Cancel Slack, Notion, Jira, and Drive. One workspace, everything included.',
  },
]

// ── Corner + icons ────────────────────────────────────────────────────────────

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={22}
    height={22}
    strokeWidth="1"
    stroke="currentColor"
    className={cn('text-white/20', className)}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
)

const CornerPlusIcons = () => (
  <>
    <PlusIcon className="absolute -top-[11px] -left-[11px]" />
    <PlusIcon className="absolute -top-[11px] -right-[11px]" />
    <PlusIcon className="absolute -bottom-[11px] -left-[11px]" />
    <PlusIcon className="absolute -bottom-[11px] -right-[11px]" />
  </>
)

// ── Card ──────────────────────────────────────────────────────────────────────

const PlusCard: React.FC<{
  className?: string
  title: string
  description: string
}> = ({ className = '', title, description }) => (
  <div
    className={cn(
      'relative border border-dashed border-white/15 rounded-lg p-6 bg-black min-h-[200px]',
      'flex flex-col justify-between',
      className
    )}
  >
    <CornerPlusIcons />
    <div className="relative z-10 space-y-2">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
)

// ── Section ───────────────────────────────────────────────────────────────────

export function RuixenBentoSection() {
  return (
    <section className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-8 md:px-14 lg:px-20">

        {/* Grid — matches the image: 6-col, 3-row pattern */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-auto gap-4">
          {/* Row 1: Beautiful (3 cols) + Developer (2 cols) → 5 wide */}
          <PlusCard {...cardContents[0]} className="lg:col-span-3 lg:row-span-2" />
          <PlusCard {...cardContents[1]} className="lg:col-span-2 lg:row-span-2" />

          {/* Row 2 (right col): Flexible wide (4) + Dark (2) */}
          <PlusCard {...cardContents[2]} className="lg:col-span-4 lg:row-span-1" />
          <PlusCard {...cardContents[3]} className="lg:col-span-2 lg:row-span-1" />

          {/* Row 3: Fast (2) */}
          <PlusCard {...cardContents[4]} className="lg:col-span-2 lg:row-span-1" />
        </div>

        {/* Bottom-right headline — exact pattern from the image */}
        <div className="max-w-2xl ml-auto text-right px-4 mt-6 lg:-mt-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Built for performance.<br />Designed for flexibility.
          </h2>
          <p className="text-white/40 text-base leading-relaxed">
            Collabify gives you the tools to build, ship, and collaborate — without juggling five subscriptions.
            Every feature is thoughtfully integrated, not bolted on.
          </p>
        </div>

      </div>
    </section>
  )
}
