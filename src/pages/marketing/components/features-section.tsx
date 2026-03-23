import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FileText, Folder, Hash, Layers,
  Lock, MessageSquare, PenLine, ShieldCheck, Upload,
  Users, Zap,
} from 'lucide-react'
import { DisplayCards } from './display-cards'

// ── Chat mockup ───────────────────────────────────────────────────────────────
const chatMessages = [
  { initials: 'AL', name: 'Alex Liu', time: '10:28', text: 'Pushed v2 to staging 🚀', color: 'bg-blue-500/20 text-blue-400' },
  { initials: 'MK', name: 'Maria K.', time: '10:29', text: 'Looks clean! Found one edge case on mobile — leaving a comment.', color: 'bg-rose-500/20 text-rose-400' },
  { initials: 'SB', name: 'Sam B.', time: '10:30', text: 'Bundle still under 120kb ✅ LGTM from me.', color: 'bg-amber-500/20 text-amber-400' },
  { initials: 'JD', name: 'You', time: '10:31', text: 'Merging and closing the sprint ticket.', color: 'bg-violet-500/20 text-violet-400' },
]

function ChatMockup() {
  const [visible, setVisible] = useState(1)
  useEffect(() => {
    const t = setInterval(() => setVisible(v => v < chatMessages.length ? v + 1 : 1), 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-lg border border-white/8 bg-black/40">
      {/* channel header */}
      <div className="flex items-center gap-1.5 border-b border-white/8 px-3 py-2">
        <Hash className="h-3 w-3 text-white/30" />
        <span className="text-xs font-semibold text-white/70">general</span>
        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </div>
      {/* messages */}
      <div className="flex flex-1 flex-col gap-2 overflow-hidden p-3">
        <AnimatePresence mode="popLayout">
          {chatMessages.slice(0, visible).map(m => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              className="flex items-start gap-2 shrink-0"
            >
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${m.color}`}>{m.initials}</div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] font-semibold text-white/80">{m.name}</span>
                  <span className="text-[9px] text-white/30">{m.time}</span>
                </div>
                <p className="text-[10px] text-white/60 leading-relaxed">{m.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* typing indicator */}
      <div className="border-t border-white/8 px-3 py-2">
        <div className="flex items-center gap-2 rounded-md bg-white/4 px-2 py-1.5">
          <span className="text-[9px] text-white/25 select-none">Message #general…</span>
        </div>
      </div>
    </div>
  )
}

// ── Pages live collaboration mockup ──────────────────────────────────────────
const ALEX_FULL = 'We shipped the whiteboard module ahead of schedule. Cursor sync was the hardest part.'
const MARIA_WORDS = ['clearer role documentation', 'better permission defaults']

function PagesMockup() {
  const [alexText, setAlexText] = useState('')
  const [cursorOn, setCursorOn] = useState(true)
  const [mariaRange, setMariaRange] = useState(0)

  // Alex: typewriter loop
  useEffect(() => {
    let i = 0
    const tick = setInterval(() => {
      i++
      if (i > ALEX_FULL.length) {
        setTimeout(() => { i = 0; setAlexText('') }, 1200)
      } else {
        setAlexText(ALEX_FULL.slice(0, i))
      }
    }, 55)
    return () => clearInterval(tick)
  }, [])

  // cursor blink
  useEffect(() => {
    const t = setInterval(() => setCursorOn(v => !v), 500)
    return () => clearInterval(t)
  }, [])

  // Maria's selection cycles
  useEffect(() => {
    const t = setInterval(() => setMariaRange(r => (r + 1) % MARIA_WORDS.length), 3200)
    return () => clearInterval(t)
  }, [])

  const mariaBase = 'Vault access control needs '
  const mariaHighlight = MARIA_WORDS[mariaRange]

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-lg border border-white/8 bg-[#111111]">
      {/* Doc header */}
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5 bg-black/30">
        <FileText className="h-3.5 w-3.5 text-pink-400 shrink-0" />
        <span className="text-xs font-semibold text-white/70">Sprint Retrospective · Q1 2025</span>
        <div className="ml-auto flex items-center gap-1.5">
          {/* Presence avatars */}
          {[{i:'AL',c:'bg-blue-500'},{i:'MK',c:'bg-rose-500'}].map(u => (
            <div key={u.i} className="relative">
              <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold text-white ${u.c}`}>{u.i}</div>
              <div className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 border border-[#111]" />
            </div>
          ))}
          <Lock className="ml-1 h-3 w-3 text-white/20" />
        </div>
      </div>

      {/* Editor body */}
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-5 gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Page title */}
        <h1 className="text-base font-black text-white/90 leading-tight">Sprint Retrospective</h1>

        {/* Section: What went well */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-white/40">What went well</h2>
          <div className="text-[11px] text-white/65 leading-relaxed">
            {alexText}
            {/* Cursor + floating label above */}
            <span className="relative inline-block">
              {alexText.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-0 mb-0.5 whitespace-nowrap rounded-t rounded-br px-1 py-px text-[8px] font-semibold bg-blue-500 text-white leading-tight"
                >
                  Alex
                </motion.span>
              )}
              <span className={`inline-block w-px h-3.5 bg-blue-400 align-middle transition-opacity ${cursorOn ? 'opacity-100' : 'opacity-0'}`} />
            </span>
          </div>
        </div>

        {/* Section: What to improve */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-white/40">What to improve</h2>
          <div className="text-[11px] text-white/65 leading-relaxed">
            <span>{mariaBase}</span>
            {/* Selection highlight + floating label above */}
            <span className="relative inline-block">
              <motion.span
                key={`label-${mariaRange}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-0 mb-0.5 whitespace-nowrap rounded-t rounded-br px-1 py-px text-[8px] font-semibold bg-rose-500 text-white leading-tight"
              >
                Maria
              </motion.span>
              <motion.span
                key={mariaRange}
                initial={{ backgroundColor: 'rgba(244,63,94,0)' }}
                animate={{ backgroundColor: 'rgba(244,63,94,0.22)' }}
                transition={{ duration: 0.4 }}
                className="rounded-sm px-0.5"
              >
                {mariaHighlight}
              </motion.span>
            </span>
          </div>
        </div>

        {/* Static sections below */}
        <div className="flex flex-col gap-1.5 mt-1 opacity-30">
          <div className="h-2 w-3/4 rounded bg-white/20" />
          <div className="h-2 w-full rounded bg-white/15" />
          <div className="h-2 w-5/6 rounded bg-white/15" />
        </div>
      </div>
    </div>
  )
}

// ── Vault mockup ──────────────────────────────────────────────────────────────
function VaultMockup() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setProgress(p => p >= 100 ? 0 : p + 8), 120)
    return () => clearInterval(t)
  }, [])

  const files = [
    { name: 'Designs', type: 'folder', color: 'text-amber-400' },
    { name: 'Q1-Report.pdf', type: 'file', color: 'text-rose-400' },
    { name: 'Assets', type: 'folder', color: 'text-amber-400' },
    { name: 'README.md', type: 'file', color: 'text-blue-400' },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-lg border border-white/8 bg-black/40">
      <div className="flex items-center gap-1.5 border-b border-white/8 px-3 py-2">
        <ShieldCheck className="h-3 w-3 text-emerald-400" />
        <span className="text-[10px] font-semibold text-white/70">Project Vault</span>
        <Upload className="ml-auto h-3 w-3 text-white/30" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2">
        {files.map(f => (
          <div key={f.name} className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/4">
            <Folder className={`h-3 w-3 shrink-0 ${f.color}`} />
            <span className="text-[10px] text-white/60 truncate">{f.name}</span>
          </div>
        ))}
      </div>
      {/* usage + upload progress */}
      <div className="border-t border-white/8 px-3 py-2 flex flex-col gap-1.5">
        <div className="flex justify-between text-[9px] text-white/30">
          <span>Uploading brand-assets.zip…</span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
        <div className="h-1 w-full rounded-full bg-white/8 overflow-hidden">
          <motion.div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>
    </div>
  )
}

// ── Sync stat widget ──────────────────────────────────────────────────────────
function SyncWidget() {
  const [ms, setMs] = useState(12)
  useEffect(() => {
    const t = setInterval(() => setMs(Math.floor(Math.random() * 8) + 9), 1400)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="relative flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-violet-400/30"
            style={{ width: 36 + i * 24, height: 36 + i * 24 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}
        <Zap className="h-5 w-5 text-violet-400 relative z-10" />
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={ms}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-3xl font-black text-white"
        >
          {ms}ms
        </motion.span>
      </AnimatePresence>
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-white/40 uppercase tracking-widest">Real-time sync</span>
        <div className="flex gap-3 text-[9px] text-white/25">
          <span>24 WS events</span>
          <span>·</span>
          <span>3 modules</span>
        </div>
      </div>
    </div>
  )
}

// ── Whiteboard mockup ─────────────────────────────────────────────────────────
function WhiteboardMockup() {
  const cursors = [
    { name: 'Alex', color: 'bg-blue-500', x: '25%', y: '40%', d: 4.5 },
    { name: 'Maria', color: 'bg-rose-500', x: '60%', y: '25%', d: 5.2 },
    { name: 'Sam', color: 'bg-amber-500', x: '75%', y: '60%', d: 4.8 },
  ]

  return (
    <div className="relative h-full overflow-hidden rounded-lg border border-white/8 bg-zinc-950">
      {/* toolbar */}
      <div className="absolute top-0 inset-x-0 flex items-center gap-2 border-b border-white/8 bg-black/60 px-3 py-1.5 z-10">
        <PenLine className="h-3 w-3 text-fuchsia-400" />
        <span className="text-[10px] font-semibold text-white/60">Sprint Planning Board</span>
        <div className="ml-auto flex items-center gap-1">
          {cursors.map(c => (
            <div key={c.name} className={`h-3.5 w-3.5 rounded-full ${c.color} text-[7px] flex items-center justify-center text-white font-bold`}>
              {c.name[0]}
            </div>
          ))}
        </div>
      </div>
      {/* canvas */}
      <div className="absolute inset-0 pt-8">
        {/* shapes */}
        <div className="absolute left-[12%] top-[25%] h-14 w-24 rounded-lg border border-violet-500/40 bg-violet-500/8 flex items-center justify-center">
          <span className="text-[9px] text-violet-300/60 font-medium">Auth Flow</span>
        </div>
        <div className="absolute left-[45%] top-[30%] h-10 w-20 rounded border border-indigo-500/40 bg-indigo-500/8 flex items-center justify-center">
          <span className="text-[9px] text-indigo-300/60 font-medium">API Layer</span>
        </div>
        <div className="absolute left-[68%] top-[50%] h-10 w-[70px] rounded-full border border-pink-500/40 bg-pink-500/8 flex items-center justify-center">
          <span className="text-[9px] text-pink-300/60 font-medium">Deploy</span>
        </div>
        {/* arrow line SVG */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none">
          <motion.line x1="34%" y1="38%" x2="45%" y2="38%" stroke="rgba(139,92,246,0.3)" strokeWidth="1.5" strokeDasharray="4 3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }} />
          <motion.line x1="65%" y1="38%" x2="70%" y2="55%" stroke="rgba(99,102,241,0.3)" strokeWidth="1.5" strokeDasharray="4 3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 3 }} />
        </svg>
        {/* live cursors */}
        {cursors.map(c => (
          <motion.div
            key={c.name}
            className="absolute flex items-center gap-1 pointer-events-none"
            style={{ left: c.x, top: c.y }}
            animate={{ x: [0, 6, -4, 0], y: [0, -4, 6, 0] }}
            transition={{ duration: c.d, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className={`h-2.5 w-0.5 ${c.color} rounded-full`} style={{ transform: 'rotate(-20deg)' }} />
            <span className={`text-[8px] font-semibold px-1 py-0.5 rounded ${c.color} text-white`}>{c.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Members/workspace widget ──────────────────────────────────────────────────
function MembersMockup() {
  const members = [
    { initials: 'JD', name: 'James D.', role: 'Owner', color: 'bg-violet-500/20 text-violet-400' },
    { initials: 'AL', name: 'Alex Liu', role: 'Admin', color: 'bg-blue-500/20 text-blue-400' },
    { initials: 'MK', name: 'Maria K.', role: 'Member', color: 'bg-rose-500/20 text-rose-400' },
    { initials: 'SB', name: 'Sam B.', role: 'Member', color: 'bg-amber-500/20 text-amber-400' },
  ]
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-lg border border-white/8 bg-black/40">
      <div className="flex items-center gap-1.5 border-b border-white/8 px-3 py-2">
        <Users className="h-3 w-3 text-sky-400" />
        <span className="text-[10px] font-semibold text-white/70">Workspace Members</span>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 p-2">
        {members.map(m => (
          <div key={m.name} className="flex items-center gap-2 rounded-md px-2 py-1">
            <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold shrink-0 ${m.color}`}>{m.initials}</div>
            <span className="text-[10px] text-white/60 flex-1 truncate">{m.name}</span>
            <span className="text-[9px] text-white/25 bg-white/5 rounded px-1.5 py-0.5">{m.role}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main section ─────────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

function BentoCard({
  children, className = '', delay = 0,
}: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`flex flex-col overflow-hidden rounded-xl border border-white/8 bg-zinc-900/80 p-5 hover:border-white/15 transition-colors ${className}`}
    >
      {children}
    </motion.div>
  )
}

function CardLabel({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="mt-4 shrink-0">
      <h3 className="flex items-center gap-2 text-base font-bold text-white">{icon}{title}</h3>
      <p className="mt-0.5 text-xs text-white/40 leading-relaxed">{description}</p>
    </div>
  )
}

export function FeaturesBentoSection() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-8 md:px-14 lg:px-20">
        {/* Header */}
        <div className="mb-12">
          <motion.h2
            className="max-w-xl text-3xl font-black tracking-tight text-white md:text-5xl leading-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            Every tool your team needs.{' '}
            <span className="bg-linear-to-r from-[#5227FF] via-[#8B5CF6] to-[#FF9FFC] bg-clip-text text-transparent">
              Nothing extra.
            </span>
          </motion.h2>
        </div>

        {/* Bento grid — 6 col, 280px rows */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-6 auto-rows-[280px]">

          {/* Chat — 3col × 2row */}
          <BentoCard className="md:col-span-3 md:row-span-2" delay={0}>
            <div className="flex-1 min-h-0"><ChatMockup /></div>
            <CardLabel
              icon={<MessageSquare className="h-4 w-4 text-violet-400" />}
              title="Chat"
              description="Channels, threads, group DMs, reactions, typing indicators and read receipts — 58 APIs, 13 WS events."
            />
          </BentoCard>

          {/* Issues / DisplayCards — 3col × 2row */}
          <BentoCard className="md:col-span-3 md:row-span-2" delay={0.06}>
            <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
              <div className="-translate-x-10">
                <DisplayCards />
              </div>
            </div>
            <CardLabel
              icon={<Layers className="h-4 w-4 text-indigo-400" />}
              title="Issues & Kanban"
              description="Custom statuses, labels, drag-and-drop reorder, S3 attachments — 19 APIs across the full issue lifecycle."
            />
          </BentoCard>

          {/* Pages — 4col × 2row */}
          <BentoCard className="md:col-span-4 md:row-span-2" delay={0.12}>
            <div className="flex-1 min-h-0"><PagesMockup /></div>
            <CardLabel
              icon={<FileText className="h-4 w-4 text-pink-400" />}
              title="Pages"
              description="Live collaborative docs — real-time cursor presence, simultaneous editing, page locking. 4 WS events."
            />
          </BentoCard>

          {/* Vault — 2col × 1row */}
          <BentoCard className="md:col-span-2" delay={0.18}>
            <div className="flex-1 min-h-0"><VaultMockup /></div>
            <CardLabel
              icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
              title="Vault"
              description="S3-backed file storage with nested folders and role-based access."
            />
          </BentoCard>

          {/* Real-time Sync — 2col × 1row */}
          <BentoCard className="md:col-span-2" delay={0.24}>
            <div className="flex-1 min-h-0"><SyncWidget /></div>
            <CardLabel
              icon={<Zap className="h-4 w-4 text-violet-400" />}
              title="Real-time Sync"
              description="Sub-16ms updates across every tab via WebSocket events."
            />
          </BentoCard>

          {/* Whiteboard — 4col × 1row */}
          <BentoCard className="md:col-span-4" delay={0.3}>
            <div className="flex-1 min-h-0"><WhiteboardMockup /></div>
            <CardLabel
              icon={<PenLine className="h-4 w-4 text-fuchsia-400" />}
              title="Whiteboard"
              description="Infinite canvas with live cursors, pointer sync, selection awareness — 7 WS events, board locking."
            />
          </BentoCard>

          {/* Members / Workspace — 2col × 1row */}
          <BentoCard className="md:col-span-2" delay={0.36}>
            <div className="flex-1 min-h-0"><MembersMockup /></div>
            <CardLabel
              icon={<Lock className="h-4 w-4 text-sky-400" />}
              title="Roles & Access"
              description="Granular RBAC across workspace, project, channel, and file level."
            />
          </BentoCard>

        </div>
      </div>
    </section>
  )
}
