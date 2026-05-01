import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Circle, Minus, Timer } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type Priority = 'urgent' | 'high' | 'medium' | 'low'
type Status   = 'in-progress' | 'todo' | 'done' | 'backlog'

interface IssueCardProps {
  className?: string
  id?: string
  title?: string
  priority?: Priority
  status?: Status
  labels?: Array<string>
  assignee?: string
  assigneeColor?: string
}

// ── Sub-components ────────────────────────────────────────────────────────────

const priorityConfig: Record<Priority, { icon: React.ReactNode; color: string; label: string }> = {
  urgent: { icon: <AlertCircle className="h-3 w-3" />, color: 'text-danger-primary400',    label: 'Urgent' },
  high:   { icon: <ArrowUp     className="h-3 w-3" />, color: 'text-warning-primary400', label: 'High'   },
  medium: { icon: <Minus       className="h-3 w-3" />, color: 'text-warning-primary400', label: 'Medium' },
  low:    { icon: <ArrowDown   className="h-3 w-3" />, color: 'text-accent-primary400',   label: 'Low'    },
}

const statusConfig: Record<Status, { icon: React.ReactNode; color: string; label: string }> = {
  'in-progress': { icon: <Timer       className="h-3 w-3" />, color: 'text-accent-primary400', label: 'In Progress' },
  'todo':        { icon: <Circle      className="h-3 w-3" />, color: 'text-white/40',   label: 'Todo'        },
  'done':        { icon: <CheckCircle2 className="h-3 w-3" />, color: 'text-success-primary400', label: 'Done'      },
  'backlog':     { icon: <Circle      className="h-3 w-3" />, color: 'text-white/25',   label: 'Backlog'     },
}

function IssueCard({
  className,
  id = 'COL-1',
  title = 'Untitled issue',
  priority = 'medium',
  status = 'todo',
  labels = [],
  assignee = 'JD',
  assigneeColor = 'bg-accent-subtle500',
}: IssueCardProps) {
  const p = priorityConfig[priority]
  const s = statusConfig[status]

  return (
    <div
      className={cn(
        // size + skew (shared with original DisplayCards animation system)
        'relative flex w-80 -skew-y-[8deg] select-none flex-col gap-3 rounded-xl',
        'border border-white/10 bg-layer-900 px-4 py-3.5',
        'shadow-overlay-200 shadow-black/50 transition-all duration-700',
        // hover lift
        'hover:border-white/20 hover:bg-layer-800',
        // original stacking pseudo-element fade
        'after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem]',
        'after:bg-linear-to-l after:from-background after:to-transparent after:content-[""]',
        className,
      )}
    >
      {/* Row 1: ID + priority */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-white/30">{id}</span>
        <span className={cn('flex items-center gap-1 text-[10px] font-medium', p.color)}>
          {p.icon}
          {p.label}
        </span>
      </div>

      {/* Row 2: Title */}
      <p className="text-14 font-semibold text-white/90 leading-snug line-clamp-2">{title}</p>

      {/* Row 3: Status + labels + assignee */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status badge */}
        <span className={cn('flex items-center gap-1 rounded-full border border-white/8 bg-white/5 px-2 py-0.5 text-[10px] font-medium', s.color)}>
          {s.icon}
          {s.label}
        </span>

        {/* Labels */}
        {labels.map(l => (
          <span key={l} className="rounded-full border border-white/8 bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
            {l}
          </span>
        ))}

        {/* Assignee */}
        <div className={cn('ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-white shrink-0', assigneeColor)}>
          {assignee}
        </div>
      </div>
    </div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

const defaultIssues: Array<IssueCardProps> = [
  {
    id: 'COL-103',
    title: 'Add real-time typing indicators to channel chat',
    priority: 'high',
    status: 'in-progress',
    labels: ['chat', 'websocket'],
    assignee: 'AL',
    assigneeColor: 'bg-accent-primary500',
    className: '[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[""] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0',
  },
  {
    id: 'COL-98',
    title: 'Implement role-based access for Vault file download',
    priority: 'urgent',
    status: 'todo',
    labels: ['vault', 'auth'],
    assignee: 'MK',
    assigneeColor: 'bg-danger-subtle500',
    className: '[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[""] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0',
  },
  {
    id: 'COL-91',
    title: 'Cursor awareness sync for Whiteboard collaborators',
    priority: 'medium',
    status: 'done',
    labels: ['whiteboard'],
    assignee: 'SB',
    assigneeColor: 'bg-warning-subtle500',
    className: '[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10',
  },
]

// ── Export ────────────────────────────────────────────────────────────────────

interface DisplayCardsProps {
  issues?: Array<IssueCardProps>
}

export function DisplayCards({ issues }: DisplayCardsProps) {
  const cards = issues ?? defaultIssues
  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {cards.map((issue, i) => (
        <IssueCard key={i} {...issue} />
      ))}
    </div>
  )
}
