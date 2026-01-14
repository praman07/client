import {
  MarketingCTA,
  MarketingFeatureChat,
  MarketingFeatureDocs,
  MarketingFeatures,
  MarketingFooter,
  MarketingHero,
  MarketingLogos,
  MarketingNavbar,
} from './components'

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNavbar />
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
