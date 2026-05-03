export function PagesSection() {
  return (
    <section className="w-full flex justify-center py-20">
      <div className="w-full max-w-[1200px] flex flex-row items-stretch gap-12 px-6">

        {/* Left — Pages Editor Mockup (~60%) */}
        <div className="w-full max-w-[640px] rounded-lg border border-subtle bg-surface-1 flex flex-col overflow-hidden">

          {/* Editor layout — max-w-3xl centered */}
          <div className="mx-auto w-full max-w-3xl px-6 pt-6 pb-10">

            {/* Collaborator bar (presence avatars) */}
            <div className="flex items-center gap-1 mb-4">
              <div className="h-7 w-7 rounded-full ring-2 flex items-center justify-center shrink-0" style={{ borderColor: '#7c3aed', backgroundColor: '#7c3aed' }}>
                <span className="text-11 font-semibold text-white">AK</span>
              </div>
              <div className="h-7 w-7 rounded-full ring-2 flex items-center justify-center shrink-0 -ml-1" style={{ borderColor: '#f59e0b', backgroundColor: '#f59e0b' }}>
                <span className="text-11 font-semibold text-white">SR</span>
              </div>
            </div>

            {/* Page title */}
            <div className="mb-2">
              <div className="w-full text-32 font-semibold tracking-tight text-primary leading-tight pl-[53px]">
                Project Planning
              </div>
            </div>

            {/* Block-based content */}
            <div className="pl-[53px]">

              {/* Block 1: Heading H1 */}
              <div className="mt-1 mb-1 py-px">
                <span className="text-32 font-bold tracking-tight text-primary">API Integration</span>
              </div>

              {/* Block 2: Paragraph with mention */}
              <div className="mt-1 mb-1 py-px">
                <span className="text-16 text-primary leading-relaxed">
                  We should finalize the API flow this week.
                </span>
              </div>

              {/* Block 3: Paragraph with user mention */}
              <div className="mt-1 mb-1 py-px">
                <span className="text-16 text-primary leading-relaxed">
                  <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(265_50%_60%/0.12)] text-[hsl(265_70%_72%)]">@Alex Kim</span>
                  {' '}can you review the authentication endpoints before the sprint review?
                </span>
              </div>

              {/* Block 4: Bullet list */}
              <div className="mt-1 mb-1 py-px">
                <ul className="text-16 text-primary leading-relaxed pl-6" style={{ listStyleType: 'disc' }}>
                  <li className="mt-0.5 mb-0.5">Define REST endpoints for user management</li>
                  <li className="mt-0.5 mb-0.5">Add WebSocket for real-time notifications</li>
                  <li className="mt-0.5 mb-0.5">Write integration tests for auth flow</li>
                </ul>
              </div>

              {/* Block 5: Paragraph with issue mention */}
              <div className="mt-1 mb-1 py-px">
                <span className="text-16 text-primary leading-relaxed">
                  Tracking progress in
                </span>
                {' '}
                <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(38_70%_50%/0.12)] text-[hsl(38_80%_65%)]">PROD-42</span>
                <span className="text-16 text-primary leading-relaxed">.</span>
              </div>

              {/* Block 6: Slash command hint */}
              <div className="mt-1 mb-1 py-px">
                <span className="text-16 text-primary leading-relaxed">
                  <span className="text-[hsl(220_50%_55%/0.12)] text-primary cursor-text">/</span>
                  <span className="text-tertiary opacity-70"> to insert blocks, create docs, and link issues</span>
                </span>
              </div>

            </div>

            {/* Slash menu (floating panel) */}
            <div className="mt-3 pl-[53px]">
              <div className="csm-root">
                {/* Header */}
                <div className="px-2 pt-2 pb-1">
                  <span className="text-12 font-medium text-primary">Basic blocks</span>
                </div>
                {/* Items */}
                <div className="px-1 pb-1">
                  <div className="flex items-center gap-2.5 px-1.5 py-1.5 rounded cursor-pointer hover:bg-surface-2">
                    <div className="w-7 h-7 rounded border border-subtle bg-layer-1 flex items-center justify-center shrink-0">
                      <span className="text-12 text-primary">T</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-14 text-primary block truncate">Text</span>
                    </div>
                    <span className="text-12 font-mono text-tertiary shrink-0 ml-auto">/</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-1.5 py-1.5 rounded cursor-pointer bg-surface-2">
                    <div className="w-7 h-7 rounded border border-subtle bg-layer-1 flex items-center justify-center shrink-0">
                      <span className="text-12 text-primary font-bold">H1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-14 text-primary block truncate">Heading 1</span>
                      <span className="text-11 text-tertiary block truncate">Big section heading</span>
                    </div>
                    <span className="text-12 font-mono text-tertiary shrink-0 ml-auto">#</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-1.5 py-1.5 rounded cursor-pointer hover:bg-surface-2">
                    <div className="w-7 h-7 rounded border border-subtle bg-layer-1 flex items-center justify-center shrink-0">
                      <span className="text-12 text-primary">•</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-14 text-primary block truncate">Bullet List</span>
                    </div>
                    <span className="text-12 font-mono text-tertiary shrink-0 ml-auto">-</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-1.5 py-1.5 rounded cursor-pointer hover:bg-surface-2">
                    <div className="w-7 h-7 rounded border border-subtle bg-layer-1 flex items-center justify-center shrink-0">
                      <span className="text-12 text-primary">☑</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-14 text-primary block truncate">To-do list</span>
                    </div>
                    <span className="text-12 font-mono text-tertiary shrink-0 ml-auto">[]</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-1.5 py-1.5 rounded cursor-pointer hover:bg-surface-2">
                    <div className="w-7 h-7 rounded border border-subtle bg-layer-1 flex items-center justify-center shrink-0">
                      <span className="text-12 text-primary">""</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-14 text-primary block truncate">Quote</span>
                    </div>
                    <span className="text-12 font-mono text-tertiary shrink-0 ml-auto">&gt;</span>
                  </div>
                </div>
                {/* Footer */}
                <div className="flex items-center justify-between px-3 py-1.5 border-t border-subtle">
                  <span className="text-13 text-tertiary">Close menu</span>
                  <span className="text-11 font-mono text-tertiary">esc</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right — Content (~40%) */}
        <div className="flex flex-col justify-center pl-4 max-w-[400px]">

          <h2 className="text-24 font-semibold font-heading text-primary tracking-tight">
            Collaborative docs that stay in context
          </h2>

          <p className="text-14 text-secondary mt-3 leading-relaxed">
            Pages are built around blocks — not rigid templates. Write, link, and organize everything in one place. Your documentation stays connected to the work, not scattered across tools.
          </p>

          <ul className="mt-6 space-y-2">
            {[
              'Block-based rich editor (BlockNote)',
              'Real-time collaboration with live cursors',
              'Slash commands for fast content creation',
              'Link issues, pages, and people inline',
              'Nested pages and structured wikis',
              'Version history and conflict resolution',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-tertiary mt-0.5">—</span>
                <span className="text-14 text-primary">{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-13 text-secondary mt-6 italic">
            Docs are not an afterthought — they're woven into every issue, chat, and project in your workspace.
          </p>

        </div>

      </div>
    </section>
  );
}
