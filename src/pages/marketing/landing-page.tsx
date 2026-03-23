import { HeroSection }          from './components/hero-section'
import { FeaturesBentoSection }  from './components/features-section'
import { RuixenBentoSection }    from './components/ruixen-bento-section'
import { ManifestoSection }      from './components/manifesto-section'
import { TestimonialsSection }   from './components/testimonials-section'
import { PricingSection }        from './components/pricing-section'

export function LandingPage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesBentoSection />
      <RuixenBentoSection />
      <ManifestoSection />
      <TestimonialsSection />
      <PricingSection />
    </div>
  )
}
