import { Link } from '@tanstack/react-router';

export function CtaSection() {
  return (
    <section className="w-full flex justify-center py-24">
      <div className="w-full max-w-[680px] px-6 text-center">

        {/* Heading */}
        <h2 className="text-28 font-heading font-semibold text-primary tracking-tight">
          Try it. Break it. Tell me what's missing.
        </h2>

        {/* Supporting text */}
        <p className="text-16 text-secondary leading-relaxed mt-6 max-w-[580px] mx-auto">
          Collabifyy is live and usable today. Some parts are still rough, and that's expected.
        </p>
        <p className="text-16 text-secondary leading-relaxed mt-4 max-w-[580px] mx-auto">
          If something doesn't work the way you expect or feels like it should exist but doesn't that's exactly what helps shape what comes next.
        </p>

        {/* CTA */}
        <div className="mt-10">
          <Link
            to="/sign-up"
            className="inline-flex h-11 items-center justify-center rounded bg-accent-primary px-6 text-14 font-semibold text-on-color transition-opacity duration-150 hover:opacity-90"
          >
            Start using Collabifyy
          </Link>
        </div>

        {/* Secondary line */}
        <p className="text-13 text-tertiary mt-4">
          No waitlist. No credit card. Just try it.
        </p>

        {/* Contact */}
        <p className="text-13 text-tertiary mt-3">
          Or reach out directly: <a href="mailto:contact@collabifyy.com" className="hover:text-primary transition-colors">contact@collabifyy.com</a>
        </p>

      </div>
    </section>
  );
}
