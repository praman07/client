import { Link } from '@tanstack/react-router'
import { Button } from '@/shared/ui'

export function MarketingCTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-6 bg-primary text-primary-foreground rounded-3xl p-10 md:p-16 lg:p-20 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl z-10">
            Ready to transform how your team works?
          </h2>
          <p className="mx-auto max-w-xl text-primary-foreground/80 md:text-xl z-10">
            Join thousands of teams already using Collabify to ship faster and
            better. Start your free trial today.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-12 px-8 text-base font-semibold z-10"
            asChild
          >
            <Link to="/sign-up">Get Started for Free</Link>
          </Button>
          <p className="text-sm text-primary-foreground/60 z-10">
            No credit card attached. 14-day free trial.
          </p>
        </div>
      </div>
    </section>
  )
}
