export function ReferencesSection() {
  return (
    <section className="w-full flex justify-center py-20">
      <div className="w-full max-w-[1200px] flex flex-row items-stretch gap-12 px-6">

        {/* Left — Reference examples (~60%) */}
        <div className="w-full max-w-[640px] rounded-lg border border-subtle bg-surface-1 overflow-hidden">

          {/* Chat message with mention + issue tag */}
          <div className="px-4 py-3 border-b border-subtle">
            <span className="text-10 text-tertiary">in #backend — Alex Kim, 10:32 AM</span>
            <p className="text-14 text-primary leading-relaxed mt-1">
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(265_50%_60%/0.12)] text-[hsl(265_70%_72%)]">@Sam Rivera</span>
              {' '}the auth flow looks solid. We should reference this in the design doc.
            </p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(38_70%_50%/0.12)] text-[hsl(38_80%_65%)]">ISSUE-42</span>
              <span className="text-11 text-tertiary">2 references</span>
            </div>
          </div>

          {/* Chat message with page reference */}
          <div className="px-4 py-3 border-b border-subtle">
            <span className="text-10 text-tertiary">in #product-dev — Jordan Lee, 11:15 AM</span>
            <p className="text-14 text-primary leading-relaxed mt-1">
              I'll link
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(220_50%_55%/0.12)] text-[hsl(220_70%_70%)] ml-0.5 mr-0.5">API Design</span>
              to
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(38_70%_50%/0.12)] text-[hsl(38_80%_65%)] ml-0.5 mr-0.5">ISSUE-42</span>
              so the frontend team has full context.
            </p>
          </div>

          {/* Page content with file + issue tags */}
          <div className="px-4 py-3 border-b border-subtle">
            <span className="text-10 text-tertiary">in Pages — System Architecture</span>
            <p className="text-14 text-primary leading-relaxed mt-1">
              The WebSocket layer connects to
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(220_50%_55%/0.12)] text-[hsl(220_70%_70%)] ml-0.5 mr-0.5">api-schema.pdf</span>
              attached below. Related to
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(38_70%_50%/0.12)] text-[hsl(38_80%_65%)] ml-0.5 mr-0.5">ISSUE-31</span>.
            </p>
          </div>

          {/* Chat with file + whiteboard reference */}
          <div className="px-4 py-3">
            <span className="text-10 text-tertiary">in #design — Morgan Park, 2:48 PM</span>
            <p className="text-14 text-primary leading-relaxed mt-1">
              Updated the wireframes. Attached
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(220_50%_55%/0.12)] text-[hsl(220_70%_70%)] ml-0.5 mr-0.5">design-v2.fig</span>
              and linked it to
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(168_50%_45%/0.12)] text-[hsl(168_60%_60%)] ml-0.5 mr-0.5">Wireframes v2</span>
              whiteboard.
            </p>
          </div>

        </div>

        {/* Right — Content (~40%) */}
        <div className="flex flex-col justify-center pl-4 max-w-[400px]">

          <h2 className="text-24 font-semibold font-heading text-primary tracking-tight">
            Everything is referenceable
          </h2>

          <p className="text-14 text-secondary mt-3 leading-relaxed">
            Every piece of work — issues, pages, messages, files, and boards — can be referenced from anywhere inside a project. Nothing is isolated.
          </p>

          <ul className="mt-6 space-y-2">
            {[
              'Real-time cross-module references',
              'Resolved links with full context',
              'Automatic backlink tracking',
              'Shared context across conversations',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-tertiary mt-0.5">—</span>
                <span className="text-14 text-primary">{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-13 text-secondary mt-6 italic">
            References aren't plain text — every mention resolves to a real object with state, access control, and history.
          </p>

        </div>

      </div>
    </section>
  );
}
