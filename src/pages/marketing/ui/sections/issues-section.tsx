export function IssuesSection() {
  return (
    <section className="w-full flex justify-center py-20">
      <div className="w-full max-w-[1200px] flex flex-row items-stretch gap-12 px-6">

        {/* Left — Issues Board Mockup (~60%) */}
        <div className="w-full max-w-[640px] rounded-lg border border-subtle bg-surface-1 flex flex-col overflow-hidden">

          {/* Board toolbar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-subtle">
            <span className="text-14 font-semibold text-primary">Project Issues</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-11 text-secondary">Sprint 4</span>
              <span className="w-1.5 h-1.5 rounded-full bg-success-primary inline-block" />
            </div>
          </div>

          {/* Kanban columns */}
          <div className="flex-1 flex gap-3 p-4 overflow-hidden">

            {/* Column: Todo */}
            <div className="flex w-80 shrink-0 flex-col rounded-lg border border-subtle bg-layer-1">
              {/* Column header */}
              <div className="flex shrink-0 items-center gap-1 px-2 py-2.5">
                <span className="inline-flex items-center gap-1.5 text-13 text-secondary">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                  </svg>
                  Todo
                </span>
                <span className="ml-auto rounded-full px-2 py-0 text-12 bg-layer-3 text-secondary border border-subtle">2</span>
              </div>

              {/* Cards */}
              <div className="flex min-h-20 flex-col gap-2 p-2 overflow-y-auto">

                {/* Issue card 1 — full state: issue number + title + 2 labels + priority + due date + assignee */}
                <div className="group select-none rounded-lg border border-subtle-1 bg-layer-1 p-3 shadow-raised-100 cursor-grab">
                  {/* Row 1: Issue number */}
                  <p className="mb-1 text-10 text-secondary opacity-0 group-hover:opacity-60 select-none font-mono">
                    PROD-42
                  </p>
                  {/* Row 2: Title */}
                  <p className="line-clamp-2 text-14 font-medium leading-snug text-primary">
                    Fix WebSocket reconnect bug
                  </p>
                  {/* Row 3: Labels */}
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-12 font-medium whitespace-nowrap"
                      style={{ backgroundColor: '#7c3aed1F', borderWidth: 1, borderStyle: 'solid', borderColor: '#7c3aed60', color: '#7c3aed' }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: '#7c3aed' }} />
                      backend
                    </span>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-12 font-medium whitespace-nowrap"
                      style={{ backgroundColor: '#dc26261F', borderWidth: 1, borderStyle: 'solid', borderColor: '#dc262660', color: '#dc2626' }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: '#dc2626' }} />
                      bug
                    </span>
                  </div>
                  {/* Row 4: Meta */}
                  <div className="mt-2.5 flex items-center gap-1.5">
                    {/* Priority badge — HIGH: AlertCircle in text-warning-primary */}
                    <span className="inline-flex items-center gap-1 shrink-0 text-warning-primary">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </span>
                    <span className="flex-1" />
                    {/* Due date chip — overdue (red) */}
                    <span className="inline-flex items-center gap-1 text-11 text-danger-primary">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      May 1
                    </span>
                    {/* Assignee avatar */}
                    <span className="w-5 h-5 rounded-full bg-layer-2 flex items-center justify-center shrink-0 overflow-hidden">
                      <span className="text-9 font-semibold text-secondary">AK</span>
                    </span>
                  </div>
                </div>

                {/* Issue card 2 */}
                <div className="group select-none rounded-lg border border-subtle-1 bg-layer-1 p-3 shadow-raised-100 cursor-grab">
                  <p className="mb-1 text-10 text-secondary opacity-0 group-hover:opacity-60 select-none font-mono">
                    PROD-44
                  </p>
                  <p className="line-clamp-2 text-14 font-medium leading-snug text-primary">
                    Setup project roles system
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-12 font-medium whitespace-nowrap"
                      style={{ backgroundColor: '#db27771F', borderWidth: 1, borderStyle: 'solid', borderColor: '#db277760', color: '#db2777' }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: '#db2777' }} />
                      infra
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    {/* Priority: LOW — ArrowDown */}
                    <span className="inline-flex items-center gap-1 shrink-0 text-secondary">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                      </svg>
                    </span>
                    <span className="flex-1" />
                    {/* Assignee */}
                    <span className="w-5 h-5 rounded-full bg-layer-2 flex items-center justify-center shrink-0 overflow-hidden">
                      <span className="text-9 font-semibold text-secondary">MP</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-2 pb-2">
                <button className="w-full text-left text-12 text-secondary hover:text-primary px-2 py-1.5 rounded transition-colors">
                  + Add issue
                </button>
              </div>
            </div>

            {/* Column: In Progress */}
            <div className="flex w-80 shrink-0 flex-col rounded-lg border border-subtle bg-layer-1">
              {/* Column header */}
              <div className="flex shrink-0 items-center gap-1 px-2 py-2.5">
                <span className="inline-flex items-center gap-1.5 text-13 text-secondary">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M7 3v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  In Progress
                </span>
                <span className="ml-auto rounded-full px-2 py-0 text-12 bg-layer-3 text-secondary border border-subtle">1</span>
              </div>

              {/* Cards */}
              <div className="flex min-h-20 flex-col gap-2 p-2 overflow-y-auto">

                {/* Issue card — active/dragging style */}
                <div className="group select-none rounded-lg border border-accent-subtle bg-layer-1 p-3 shadow-raised-100 cursor-grab">
                  <p className="mb-1 text-10 text-secondary opacity-0 group-hover:opacity-60 select-none font-mono">
                    PROD-43
                  </p>
                  <p className="line-clamp-2 text-14 font-medium leading-snug text-primary">
                    Improve notification batching
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-12 font-medium whitespace-nowrap"
                      style={{ backgroundColor: '#7c3aed1F', borderWidth: 1, borderStyle: 'solid', borderColor: '#7c3aed60', color: '#7c3aed' }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: '#7c3aed' }} />
                      backend
                    </span>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-12 font-medium whitespace-nowrap"
                      style={{ backgroundColor: '#d977061F', borderWidth: 1, borderStyle: 'solid', borderColor: '#d9770660', color: '#d97706' }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: '#d97706' }} />
                      performance
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    {/* Priority: MEDIUM — Equal */}
                    <span className="inline-flex items-center gap-1 shrink-0 text-warning-primary">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="9" x2="19" y2="9" /><line x1="5" y1="15" x2="19" y2="15" />
                      </svg>
                    </span>
                    <span className="flex-1" />
                    {/* Due date chip — not overdue */}
                    <span className="inline-flex items-center gap-1 text-11 text-secondary">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      May 10
                    </span>
                    {/* Assignee */}
                    <span className="w-5 h-5 rounded-full bg-layer-2 flex items-center justify-center shrink-0 overflow-hidden">
                      <span className="text-9 font-semibold text-secondary">SR</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-2 pb-2">
                <button className="w-full text-left text-12 text-secondary hover:text-primary px-2 py-1.5 rounded transition-colors">
                  + Add issue
                </button>
              </div>
            </div>

            {/* Column: Done */}
            <div className="flex w-80 shrink-0 flex-col rounded-lg border border-subtle bg-layer-1">
              {/* Column header */}
              <div className="flex shrink-0 items-center gap-1 px-2 py-2.5">
                <span className="inline-flex items-center gap-1.5 text-13 text-secondary">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Done
                </span>
                <span className="ml-auto rounded-full px-2 py-0 text-12 bg-layer-3 text-secondary border border-subtle">1</span>
              </div>

              {/* Cards */}
              <div className="flex min-h-20 flex-col gap-2 p-2 overflow-y-auto">

                {/* Issue card — done (dimmed) */}
                <div className="group select-none rounded-lg border border-subtle-1 bg-layer-1 p-3 shadow-raised-100 opacity-60 cursor-grab">
                  <p className="mb-1 text-10 text-secondary opacity-0 group-hover:opacity-60 select-none font-mono">
                    PROD-41
                  </p>
                  <p className="line-clamp-2 text-14 font-medium leading-snug text-primary">
                    Refactor auth resolver
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-12 font-medium whitespace-nowrap"
                      style={{ backgroundColor: '#7c3aed1F', borderWidth: 1, borderStyle: 'solid', borderColor: '#7c3aed60', color: '#7c3aed' }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: '#7c3aed' }} />
                      backend
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    {/* Priority: NO_PRIORITY — Minus */}
                    <span className="inline-flex items-center gap-1 shrink-0 text-tertiary">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                    <span className="flex-1" />
                    {/* Assignee */}
                    <span className="w-5 h-5 rounded-full bg-layer-2 flex items-center justify-center shrink-0 overflow-hidden">
                      <span className="text-9 font-semibold text-secondary">AK</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-2 pb-2">
                <button className="w-full text-left text-12 text-secondary hover:text-primary px-2 py-1.5 rounded transition-colors">
                  + Add issue
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right — Content (~40%) */}
        <div className="flex flex-col justify-center pl-4 max-w-[400px]">

          <h2 className="text-24 font-semibold font-heading text-primary tracking-tight">
            Structured work, not scattered tasks
          </h2>

          <p className="text-14 text-secondary mt-3 leading-relaxed">
            Issues are the core unit of work in your workspace. Each one belongs to a project, carries a status, and carries context — so nothing falls through the cracks between tools.
          </p>

          <ul className="mt-6 space-y-2">
            {[
              'Custom status workflows',
              'Kanban-style board movement',
              'Labels and categorization',
              'Priority and assignment tracking',
              'Project-level isolation',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-tertiary mt-0.5">—</span>
                <span className="text-14 text-primary">{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-13 text-secondary mt-6 italic">
            Issues are not just tasks — they define how work flows through your team.
          </p>

        </div>

      </div>
    </section>
  );
}
