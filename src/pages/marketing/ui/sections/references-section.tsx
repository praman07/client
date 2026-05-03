export function ReferencesSection() {
  return (
    <section className="w-full flex justify-center py-20">
      <div className="max-w-[720px] mx-auto px-6">

        {/* Heading */}
        <h2 className="text-40 font-heading font-bold tracking-tight text-primary text-center leading-tight">
          Everything is referenceable.
        </h2>

        {/* Subtext */}
        <p className="text-16 text-secondary leading-relaxed mt-6 text-center max-w-[600px] mx-auto">
          Every piece of work issues, pages, messages, files, and boards can be referenced from anywhere inside a project. Nothing is isolated.
        </p>

        {/* Capability blocks */}
        <div className="mt-16 space-y-12">

          {/* Mentions */}
          <div>
            <h3 className="text-16 font-semibold text-primary tracking-tight">Mentions</h3>
            <p className="text-14 text-secondary leading-relaxed mt-2">
              Reference anything, anywhere. Issues inside chat. Pages inside issues. People inside documents.
            </p>
          </div>

          {/* Resolved links */}
          <div>
            <h3 className="text-16 font-semibold text-primary tracking-tight">Resolved links</h3>
            <p className="text-14 text-secondary leading-relaxed mt-2">
              References aren't plain text. Every mention resolves to a real object with context, state, and access control.
            </p>
          </div>

          {/* Backlinks */}
          <div>
            <h3 className="text-16 font-semibold text-primary tracking-tight">Backlinks</h3>
            <p className="text-14 text-secondary leading-relaxed mt-2">
              Every reference is tracked. See where something is used or discussed without searching.
            </p>
          </div>

          {/* Shared context */}
          <div>
            <h3 className="text-16 font-semibold text-primary tracking-tight">Shared context</h3>
            <p className="text-14 text-secondary leading-relaxed mt-2">
              Context moves with the work. Conversations, tasks, and documents stay connected as things evolve.
            </p>
          </div>

        </div>

        {/* Examples — real conversation and page lines */}
        <div className="border-t border-subtle pt-10 mt-10 space-y-3">

          {/* Chat message 1 */}
          <div className="space-y-1">
            <span className="text-10 text-tertiary">in #backend — Alex Kim, 10:32 AM</span>
            <p className="text-14 text-primary leading-relaxed">
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(265_50%_60%/0.12)] text-[hsl(265_70%_72%)]">@Sam Rivera</span>
              {' '}the auth flow looks solid. We should reference this in the design doc.
            </p>
          </div>

          {/* Chat message 2 */}
          <div className="space-y-1">
            <span className="text-10 text-tertiary">in #product-dev — Jordan Lee, 11:15 AM</span>
            <p className="text-14 text-primary leading-relaxed">
              I'll link
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(220_50%_55%/0.12)] text-[hsl(220_70%_70%)] ml-0.5 mr-0.5">API Design</span>
              to
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(38_70%_50%/0.12)] text-[hsl(38_80%_65%)] ml-0.5 mr-0.5">ISSUE-42</span>
              so the frontend team has the full context.
            </p>
          </div>

          {/* Page content line */}
          <div className="space-y-1">
            <span className="text-10 text-tertiary">in Pages — System Architecture</span>
            <p className="text-14 text-primary leading-relaxed">
              The WebSocket layer connects to
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(220_50%_55%/0.12)] text-[hsl(220_70%_70%)] ml-0.5 mr-0.5">api-schema.pdf</span>
              attached below. Related to
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(38_70%_50%/0.12)] text-[hsl(38_80%_65%)] ml-0.5 mr-0.5">ISSUE-31</span>
              .
            </p>
          </div>

          {/* Chat message 3 — file attachment */}
          <div className="space-y-1">
            <span className="text-10 text-tertiary">in #design — Morgan Park, 2:48 PM</span>
            <p className="text-14 text-primary leading-relaxed">
              Updated the wireframes. Attached
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(220_50%_55%/0.12)] text-[hsl(220_70%_70%)] ml-0.5 mr-0.5">design-v2.fig</span>
              and linked it to
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(168_50%_45%/0.12)] text-[hsl(168_60%_60%)] ml-0.5 mr-0.5">Wireframes v2</span>
              whiteboard.
            </p>
          </div>

          {/* Chat message 4 — issue reference */}
          <div className="space-y-1">
            <span className="text-10 text-tertiary">in #backend — Sam Rivera, 3:22 PM</span>
            <p className="text-14 text-primary leading-relaxed">
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(265_50%_60%/0.12)] text-[hsl(265_70%_72%)]">@Alex Kim</span>
              can you take another look at
              <span className="inline-flex items-center gap-0.5 rounded px-1 py-px text-[11px] font-medium leading-snug bg-[hsl(38_70%_50%/0.12)] text-[hsl(38_80%_65%)] ml-0.5 mr-0.5">ISSUE-31</span>
              ? This is the one blocking the deploy.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}