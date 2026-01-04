import { createFileRoute } from '@tanstack/react-router'
import { MarketingHero } from '@/widgets/marketing-hero'
import { MarketingLogos } from '@/widgets/marketing-logos'
import { MarketingFeatureDocs } from '@/widgets/marketing-feature-docs'
import { MarketingFeatureChat } from '@/widgets/marketing-feature-chat'
import { MarketingFeatures } from '@/widgets/marketing-features'
import { MarketingCTA } from '@/widgets/marketing-cta'
import { MarketingFooter } from '@/widgets/marketing-footer'

export const Route = createFileRoute('/_marketing/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHero />
      <MarketingLogos />
      <MarketingFeatureDocs />
      <MarketingFeatureChat />
      <MarketingFeatures />
      <MarketingCTA />
      <MarketingFooter />
    </div>
  )
}
