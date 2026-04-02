import { ChevronRight } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@clerk/clerk-react'
import { AppMockup } from './mockup'
import LightPillar from '@/shared/ui/LightPillar'
import { AnimatedGroup } from '@/shared/ui/primitives/animated-group'
import { Button } from '@/shared/ui/primitives/button'
import { LiquidMetalButton } from '@/shared/ui/primitives/liquid-metal-button'

const heroVariants = {
  container: {
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.5 },
    },
  },
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 16 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { type: 'spring' as const, bounce: 0.3, duration: 1.5 },
    },
  },
} as const

export function HeroSection() {
  const { isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden bg-background"
      role="region"
      aria-label="Collabify hero section"
    >
      {/* ── LightPillar background ───────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <LightPillar
          className="absolute inset-0 h-full w-full"
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={1}
          rotationSpeed={0.3}
          glowAmount={0.002}
          pillarWidth={3}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={25}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />
        <div className="absolute inset-x-0 top-0 h-44 bg-linear-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-linear-to-t from-background to-transparent" />
      </div>

      {/* ── Radial dark vignette ─────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
      />

      {/* ── Main content — left-aligned, full width ──────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 pt-36 pb-0 md:px-14 lg:px-20">
        <AnimatedGroup variants={heroVariants}>

          {/* Headline */}
          <h1 className="max-w-3xl text-balance text-5xl font-black tracking-tight text-white md:text-6xl lg:text-[4.5rem] leading-[1.08]">
            Everything app for <br /> Project Management
          </h1>

          {/* Sub-text */}
          <p className="mt-6 max-w-xl text-base text-white/50 leading-relaxed md:text-lg">
            Replace Slack, Jira, and Notion with one real-time platform.
            Chat, plan, draw, and ship — without the $300/mo bill.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            {isLoaded && (
              <LiquidMetalButton
                label={isSignedIn ? 'Go to Dashboard' : 'Start Building Free'}
                onClick={() =>
                  void navigate({ to: isSignedIn ? '/home' : '/sign-up' })
                }
              />
            )}

            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-[42px] rounded-xl px-5 text-base text-white/40 hover:text-white/80 hover:bg-white/5"
            >
              <Link to="/pricing">
                <span className="text-nowrap">View Pricing</span>
                <ChevronRight className="ml-1 inline-block size-4" />
              </Link>
            </Button>
          </div>

          {/* ── App mockup ─────────────────────────────────────────── */}
          <div className="relative mt-14 w-full max-w-5xl overflow-hidden rounded-xl border border-border/20 shadow-2xl shadow-black/70 ring-1 ring-white/5">
            <AppMockup />
            
            {/* Bottom gradient fade into the next section */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none" />
          </div>

        </AnimatedGroup>
        
      </div>
      
    </section>
  )
}
