import {
  MarketingCTA,
  MarketingFeatureChat,
  MarketingFeatureDocs,
  MarketingFeatures,
  MarketingFooter,
  MarketingHero,
  MarketingLogos,
} from './components'

export function LandingPage() {
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
