import ScrollReveal from '@/shared/ui/ScrollReveal'

// The big manifesto quote — each word animates in as you scroll
const manifestoText =
  'Your team deserves one workspace. Not five subscriptions. Not per-seat invoices. Just chat, plan, draw, and ship — together. That is why we built Collabify.'

export function ManifestoSection() {
  return (
    <section
      aria-label="Collabify manifesto"
      className="relative w-full py-24 px-8 md:px-14 lg:px-20 overflow-hidden"
    >
      {/* Subtle ambient glow behind the text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-foreground/3 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Eyebrow */}
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.35em] text-muted-foreground/60">
          Our Philosophy
        </p>

        {/* ScrollReveal animates each word on scroll */}
        <ScrollReveal
          scrollContainerRef={undefined}
          baseOpacity={0}
          enableBlur
          baseRotation={2}
          blurStrength={6}
          containerClassName="text-center"
          textClassName="text-foreground/90 font-black leading-relaxed"
          rotationEnd="bottom 80%"
          wordAnimationEnd="bottom 70%"
        >
          {manifestoText}
        </ScrollReveal>

        {/* Subtle strap below */}
        <p className="mt-10 text-center text-sm text-muted-foreground/50 font-medium tracking-wide">
          Built by a team tired of paying $300/mo for three tools that don't talk to each other.
        </p>
      </div>
    </section>
  )
}
