import { Link } from '@tanstack/react-router';

export function HeroSection() {
  return (
    <section className="flex min-h-[80vh] w-full flex-col items-center justify-center px-6 py-24">
      <div className="flex w-full max-w-[680px] flex-col items-center text-center">

        {/* ── Headline ── */}
        <h1 className="mb-5 font-heading text-40 font-semibold leading-[1.15] tracking-tight text-primary">
          One workspace for chat, tasks, docs, boards, and files connected by default.
        </h1>

        {/* ── Subtext ── */}
        <p className="mb-10 max-w-[560px] text-18 leading-relaxed text-secondary">
          Collabifyy brings everything your team uses into a single system, where conversations, work, and context stay linked instead of scattered across tools.
        </p>

        {/* ── CTA group ── */}
        <div className="mb-5 flex flex-col items-center gap-3 sm:flex-row">
          {/* Primary */}
          <Link
            to="/sign-up"
            className="inline-flex h-11 min-w-[180px] items-center justify-center rounded bg-accent-primary px-6 text-14 font-semibold text-on-color transition-opacity duration-150 hover:opacity-90"
          >
            Try Collabifyy
          </Link>

          {/* Secondary */}
          <Link
            to="/"
            className="inline-flex h-11 min-w-[220px] items-center justify-center rounded border border-subtle px-6 text-14 font-medium text-secondary transition-colors duration-150 hover:border-strong hover:text-primary"
          >
            Explore the product
          </Link>
        </div>

        {/* ── Supporting line ── */}
        <p className="text-13 text-tertiary">
          No waitlist. Use it right away. Feedback welcome.
        </p>

      </div>
    </section>
  );
}
