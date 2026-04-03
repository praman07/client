import { CheckCircle2, CreditCard, Zap } from 'lucide-react'
import { Badge } from '@/shared/ui/primitives/badge'
import { Button } from '@/shared/ui/primitives/button'
import { Separator } from '@/shared/ui/primitives/separator'

const FREE_FEATURES = [
  '3 workspaces',
  '5 members per workspace',
  '5 GB storage',
  'Basic integrations',
]

const PRO_FEATURES = [
  'Unlimited workspaces',
  'Unlimited members',
  '100 GB storage',
  'Priority support',
  'Advanced integrations',
  'Custom roles',
]

/**
 * UserBillingPage — V1 read-only billing view.
 * Shows current plan (Free) and a Pro upgrade CTA.
 * Actual Stripe integration is wired via the stripeCustomerId field.
 */
export function UserBillingPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your subscription and payment method.</p>
      </div>

      {/* Current plan */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Current plan</h3>
          </div>
          <Badge variant="secondary">Free</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {FREE_FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Pro upgrade */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Collabify Pro</h3>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">$12<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {PRO_FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
              {f}
            </div>
          ))}
        </div>

        <Button className="w-full gap-2">
          <CreditCard className="h-4 w-4" />
          Upgrade to Pro
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Billed monthly. Cancel any time.
        </p>
      </div>
    </div>
  )
}
