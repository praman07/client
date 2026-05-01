import { BentoPricing } from './bento-pricing'

export function PricingSection() {
  return (
    <section
      aria-label="Pricing overview"
      className="bg-background py-24 px-8 md:px-14 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center space-y-4">
          <p className="text-12 font-bold uppercase tracking-[0.3em] text-tertiary">
            Pricing
          </p>
          <h2 className="text-28 font-black tracking-tight text-primary md:text-40">
            One flat price.{' '}
            <span className="text-primary/50 italic">No per-seat nonsense.</span>
          </h2>
          <p className="text-tertiary text-16">
            We charge the workspace owner — not every team member. Start free,
            upgrade when you need more.
          </p>
        </div>
        <BentoPricing />
      </div>
    </section>
  )
}
