import { CheckIcon, SparklesIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/primitives/button'
import { Badge } from '@/shared/ui/primitives/badge'

type PricingCardProps = {
  titleBadge: string
  label: string
  priceLabel: string
  priceSuffix?: string
  features: Array<string>
  cta?: string
  ctaHref?: string
  className?: string
  highlighted?: boolean
}

function FilledCheck() {
  return (
    <div className="bg-primary text-on-color rounded-full p-0.5 shrink-0">
      <CheckIcon className="size-3" strokeWidth={3} />
    </div>
  )
}

// ─── Hero card (Squad — most popular) ─────────────────────────────────────────
function HeroPricingCard() {
  return (
    <div
      className={cn(
        'bg-background border-border/20 relative w-full overflow-hidden rounded-md border',
        'backdrop-blur',
        'lg:col-span-5',
      )}
    >
      {/* Grid overlay */}
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full mask-[linear-gradient(white,transparent)]">
        <div className="from-foreground/5 to-foreground/2 absolute inset-0 bg-linear-to-r mask-[radial-gradient(farthest-side_at_top,white,transparent)]">
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-0 size-full mix-blend-overlay',
              'bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_10%,transparent)_1px,transparent_1px)]',
              'bg-size-[24px]',
            )}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-4">
        <Badge variant="secondary">SQUAD · SMALL TEAM</Badge>
        <Badge variant="outline" className="flex gap-1">
          <SparklesIcon className="size-3" /> Most Popular
        </Badge>
        <div className="ml-auto">
          <Button asChild>
            <Link to="/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col p-4 lg:flex-row">
        <div className="pb-4 lg:w-[30%]">
          <span className="font-mono text-40 font-semibold tracking-tight text-primary">
            $29
          </span>
          <span className="text-tertiary text-14">/month</span>
          <p className="text-tertiary mt-1 text-12">Flat rate · No per-seat</p>
        </div>
        <ul className="text-tertiary grid gap-4 text-14 lg:w-[70%]">
          {[
            'Up to 5 workspaces per account',
            'Up to 50 members per workspace',
            'Unlimited projects in each workspace',
            '50 GB total vault storage',
          ].map((f, i) => (
            <li key={i} className="flex items-center gap-3">
              <FilledCheck />
              <span className="leading-relaxed">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── Standard card ─────────────────────────────────────────────────────────────
function PricingCard({
  titleBadge,
  priceLabel,
  priceSuffix = '/month',
  features,
  cta = 'Get Started',
  ctaHref = '/sign-up',
  className,
}: PricingCardProps) {
  const isFree = priceLabel.toLowerCase() === 'free'
  return (
    <div
      className={cn(
        'bg-background border-border/20 relative overflow-hidden rounded-md border backdrop-blur',
        className,
      )}
    >
      <div className="flex items-center gap-3 p-4">
        <Badge variant="secondary">{titleBadge}</Badge>
        <div className="ml-auto">
          <Button variant="outline" asChild>
            <Link to={ctaHref}>{cta}</Link>
          </Button>
        </div>
      </div>

      <div className="flex items-end gap-2 px-4 py-2">
        <span className="font-mono text-40 font-semibold tracking-tight text-primary">
          {priceLabel}
        </span>
        {!isFree && (
          <div className="flex flex-col pb-1">
            <span className="text-tertiary text-14">{priceSuffix}</span>
            <span className="text-tertiary text-12">Flat rate</span>
          </div>
        )}
      </div>

      <ul className="text-tertiary grid gap-4 p-4 text-14">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3">
            <FilledCheck />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Full bento grid ───────────────────────────────────────────────────────────
export function BentoPricing() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-8">
      {/* Squad — hero card, spans 5/8 */}
      <HeroPricingCard />

      {/* Starter — FREE */}
      <PricingCard
        titleBadge="STARTER · FREE"
        label="Starter"
        priceLabel="Free"
        features={[
          '1 workspace',
          'Up to 3 members',
          '2 projects max',
          '250 MB vault storage',
        ]}
        cta="Start for Free"
        ctaHref="/sign-up"
        className="lg:col-span-3"
      />

      {/* Solo */}
      <PricingCard
        titleBadge="SOLO · FREELANCER"
        label="Solo"
        priceLabel="$8"
        features={[
          '2 workspaces (personal + business)',
          'Up to 5 members per workspace',
          'Unlimited projects',
          '10 GB vault storage',
        ]}
        cta="Get Solo"
        ctaHref="/sign-up"
        className="lg:col-span-4"
      />

      {/* Power / Agency */}
      <PricingCard
        titleBadge="POWER · AGENCY"
        label="Power"
        priceLabel="$89"
        features={[
          'Unlimited workspaces',
          'Unlimited members',
          'Unlimited projects',
          '250 GB vault storage',
        ]}
        cta="Go Unlimited"
        ctaHref="/sign-up"
        className="lg:col-span-4"
      />
    </div>
  )
}
