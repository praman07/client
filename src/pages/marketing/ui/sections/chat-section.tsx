export function ChatSection() {
  return (
    <section className="w-full flex justify-center py-20">
      <div className="w-full max-w-[1200px] flex flex-row items-stretch gap-12 px-6">

        {/* Left — Chat Mockup (~60%) */}
        <div className="w-full max-w-[640px] rounded-lg border border-subtle bg-surface-1 flex flex-col overflow-hidden">

          {/* Channel header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-subtle">
            <span className="font-code text-13 font-semibold text-primary">#product-dev</span>
            <span className="text-11 bg-accent-subtle px-1.5 py-0.5 rounded-md text-secondary font-medium uppercase tracking-wider">Public</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-11 text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-success-primary inline-block" />
                8
              </span>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 px-4 py-4 space-y-0 overflow-hidden">

            {/* Message 1 — Primary (full avatar + header) */}
            <div className="flex hover:bg-layer-transparent-hover group/msg mt-3">
              {/* Avatar column */}
              <div className="w-9 shrink-0 mr-2">
                <div className="w-9 h-9 rounded-full bg-layer-1 flex items-center justify-center">
                  <span className="text-11 font-semibold text-secondary">AK</span>
                </div>
              </div>
              {/* Content column */}
              <div className="flex-1 min-w-0">
                {/* Name + timestamp row */}
                <div className="flex items-center gap-2">
                  <span className="text-14 font-semibold text-primary">Alex Kim</span>
                  <span className="text-10 text-secondary">10:32 AM</span>
                </div>
                {/* Message body */}
                <p className="text-14 text-primary mt-0.5 leading-relaxed">
                  Just pushed the new authentication flow. Should be good for review.
                </p>
                {/* Reactions */}
                <div className="flex flex-wrap gap-1 mt-2">
                  <button className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-11 font-medium border bg-layer-2 border-transparent text-secondary hover:bg-layer-2-hover">
                    <span>👍</span>
                    <span className="min-w-[1ch] text-center">3</span>
                  </button>
                  <button className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-11 font-medium border bg-accent-subtle border-accent-subtle text-primary">
                    <span>🚀</span>
                    <span className="min-w-[1ch] text-center">1</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Message 2 — Additional (compact, time in sidebar) */}
            <div className="flex hover:bg-layer-transparent-hover group/msg mt-0">
              {/* Time column (visible on hover) */}
              <div className="w-9 shrink-0 mr-2 flex items-start justify-end">
                <span className="text-10 text-secondary group-hover/msg:opacity-100 opacity-0">10:35 AM</span>
              </div>
              {/* Content column */}
              <div className="flex-1 min-w-0">
                <p className="text-14 text-primary leading-relaxed">
                  Looks solid. I'll run the integration tests on staging.
                </p>
              </div>
            </div>

            {/* Message 3 — Primary with @mention */}
            <div className="flex hover:bg-layer-transparent-hover group/msg mt-3">
              {/* Avatar column */}
              <div className="w-9 shrink-0 mr-2">
                <div className="w-9 h-9 rounded-full bg-layer-1 flex items-center justify-center">
                  <span className="text-11 font-semibold text-secondary">SR</span>
                </div>
              </div>
              {/* Content column */}
              <div className="flex-1 min-w-0">
                {/* Name + timestamp row */}
                <div className="flex items-center gap-2">
                  <span className="text-14 font-semibold text-primary">Sam Rivera</span>
                  <span className="text-10 text-secondary">10:45 AM</span>
                </div>
                {/* Message body with @mention */}
                <p className="text-14 text-primary mt-0.5 leading-relaxed">
                  <span className="bg-accent-subtle px-0.5 rounded text-accent-primary font-medium">@Jordan Lee</span> can you take a look at the API route changes? Want to make sure the token refresh logic is solid before merging.
                </p>
                {/* Reply count */}
                <button className="flex items-center gap-1 text-12 text-secondary hover:text-primary mt-1.5 transition-colors">
                  <span className="text-10">💬</span>
                  <span>2 replies</span>
                </button>
              </div>
            </div>

            {/* Message 4 — Primary with reply reference */}
            <div className="flex hover:bg-layer-transparent-hover group/msg mt-3">
              {/* Avatar column */}
              <div className="w-9 shrink-0 mr-2">
                <div className="w-9 h-9 rounded-full bg-layer-1 flex items-center justify-center">
                  <span className="text-11 font-semibold text-secondary">JL</span>
                </div>
              </div>
              {/* Content column */}
              <div className="flex-1 min-w-0">
                {/* Reply reference */}
                <button className="flex items-center gap-1.5 text-12 text-secondary hover:text-primary mb-1 border-l-2 border-subtle-1 hover:border-accent-subtle pl-2.5 py-0.5 max-h-10 overflow-hidden w-full text-left transition-colors rounded-sm">
                  <span className="text-10 shrink-0">↩</span>
                  <span>Replying to <strong>@Sam Rivera</strong> — <span className="truncate">can you take a look at the API</span></span>
                </button>
                {/* Name + timestamp row */}
                <div className="flex items-center gap-2">
                  <span className="text-14 font-semibold text-primary">Jordan Lee</span>
                  <span className="text-10 text-secondary">11:02 AM</span>
                </div>
                {/* Message body */}
                <p className="text-14 text-primary mt-0.5 leading-relaxed">
                  Sure, on it. I'll run the integration tests first to check the edge cases.
                </p>
              </div>
            </div>

            {/* Message 5 — Primary with file attachment */}
            <div className="flex hover:bg-layer-transparent-hover group/msg mt-3">
              {/* Avatar column */}
              <div className="w-9 shrink-0 mr-2">
                <div className="w-9 h-9 rounded-full bg-layer-1 flex items-center justify-center">
                  <span className="text-11 font-semibold text-secondary">AK</span>
                </div>
              </div>
              {/* Content column */}
              <div className="flex-1 min-w-0">
                {/* Name + timestamp row */}
                <div className="flex items-center gap-2">
                  <span className="text-14 font-semibold text-primary">Alex Kim</span>
                  <span className="text-10 text-secondary">11:30 AM</span>
                </div>
                {/* Message body */}
                <p className="text-14 text-primary mt-0.5 leading-relaxed">
                  Attached the updated architecture doc.
                </p>
                {/* File attachment */}
                <div className="mt-2 border border-subtle-1 rounded bg-layer-1 px-3 py-2 max-w-[260px]">
                  <div className="flex items-center gap-2">
                    <span className="text-12 text-secondary">📄</span>
                    <div className="min-w-0">
                      <span className="font-code text-12 text-primary block truncate">system-architecture-v3.pdf</span>
                      <span className="text-10 text-secondary">2.4 MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message 6 — Additional compact */}
            <div className="flex hover:bg-layer-transparent-hover group/msg mt-0">
              {/* Time column */}
              <div className="w-9 shrink-0 mr-2 flex items-start justify-end">
                <span className="text-10 text-secondary group-hover/msg:opacity-100 opacity-0">11:58 AM</span>
              </div>
              {/* Content column */}
              <div className="flex-1 min-w-0">
                <p className="text-14 text-primary leading-relaxed">
                  Looks clean. One small suggestion — we could document the error codes separately.
                </p>
                {/* Reactions */}
                <div className="flex flex-wrap gap-1 mt-2">
                  <button className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-11 font-medium border bg-layer-2 border-transparent text-secondary hover:bg-layer-2-hover">
                    <span>💡</span>
                    <span className="min-w-[1ch] text-center">2</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Input area */}
          <div className="px-4 pt-3 pb-3">
            <div className="flex flex-col w-full rounded-xl border-subtle-1 bg-layer-1">
              {/* Text input */}
              <div className="px-4 pt-3 pb-2">
                <div className="flex min-h-[40px] w-full resize-none bg-transparent py-2">
                  <span className="text-14 text-placeholder">Message #product-dev</span>
                </div>
              </div>
              {/* Toolbar */}
              <div className="flex items-center justify-between px-3 h-9 border-t border-subtle">
                <div className="flex items-center gap-1">
                  <span className="text-11 text-secondary px-1">+</span>
                  <span className="text-11 text-secondary px-1">😀</span>
                  <span className="text-11 text-secondary px-1">@</span>
                </div>
                <span className="text-11 bg-accent-primary text-on-color px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide text-10">Send</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right — Content (~40%) */}
        <div className="flex flex-col justify-center pl-4 max-w-[400px]">

          <h2 className="text-24 font-semibold font-heading text-primary tracking-tight">
            Team communication without losing context
          </h2>

          <p className="text-14 text-secondary mt-3 leading-relaxed">
            Chat lives inside your workspace, not in a separate tab. Conversations stay linked to tasks, projects, and people — so context never gets lost between tools.
          </p>

          <ul className="mt-6 space-y-2">
            {[
              'Channel-based communication',
              'Threaded replies for focused discussion',
              'Mentions and tagging for notifications',
              'Emoji reactions for lightweight feedback',
              'File sharing directly inside chat',
              'Presence system for real-time availability',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-tertiary mt-0.5">—</span>
                <span className="text-14 text-primary">{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-13 text-secondary mt-6 italic">
            Chat is not a separate tool — it's part of how work happens across the system.
          </p>

        </div>

      </div>
    </section>
  );
}
