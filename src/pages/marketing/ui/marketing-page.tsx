import { HeroSection } from './sections/hero-section';
import { ProductOverviewSection } from './sections/product-overview-section';
import { ReferencesSection } from './sections/references-section';
import { WhyBuiltSection } from './sections/why-built-section';
import { CtaSection } from './sections/cta-section';
import { FooterSection } from './sections/footer-section';

export function MarketingPage() {
  return (
    <div className="bg-surface-1 w-full flex flex-col items-center justify-start">
      <HeroSection />
      <ProductOverviewSection />
      {/* <ReferencesSection /> */}
      <WhyBuiltSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
}
