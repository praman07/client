export function WhyBuiltSection() {
  return (
    <section className="w-full flex justify-center py-20">
      <div className="w-full max-w-[720px] px-6">

        {/* Heading */}
        <h2 className="text-28 font-heading font-semibold text-primary tracking-tight mb-12">
          Why I built Collabify
        </h2>

        {/* Problem */}
        <div className="mb-10">
          <p className="text-16 text-secondary leading-relaxed">
            Most tools solve a single part of the workflow well, but using them together often creates more overhead than clarity.
          </p>
          <p className="text-16 text-secondary leading-relaxed mt-4">
            Switching between chat, tasks, docs, and files became part of the work not something that supported it.
          </p>
        </div>

        {/* Insight */}
        <div className="mb-10">
          <p className="text-16 text-secondary leading-relaxed">
            I wanted to explore what it would feel like if all of this lived in one system. Not just bundled together, but actually connected where referencing something in one place means something everywhere else.
          </p>
        </div>

        {/* What this is */}
        <div className="mb-10">
          <p className="text-16 text-secondary leading-relaxed">
            Collabify is an attempt at building that system.
          </p>
          <p className="text-16 text-secondary leading-relaxed mt-4">
            It's still evolving, but the core pieces are already usable today.
          </p>
        </div>

        {/* Invitation */}
        <div>
          <p className="text-16 text-secondary leading-relaxed">
            If something feels missing, confusing, or broken that's exactly the kind of feedback I'm looking for.
          </p>
        </div>

      </div>
    </section>
  );
}
