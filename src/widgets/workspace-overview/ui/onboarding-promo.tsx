import { Sparkles } from 'lucide-react'
import { Button, Card } from '@/shared/ui'

export function OnboardingPromo() {
  return (
    <Card className="relative overflow-hidden flex flex-col p-5 shadow-sm border-none bg-primary text-primary-foreground">
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-20 translate-x-1/4 translate-y-1/4">
        <Sparkles className="w-32 h-32" />
      </div>
      
      <h3 className="text-sm font-bold mb-2 relative z-10">Need help with onboarding?</h3>
      <p className="text-xs text-primary-foreground/90 mb-5 leading-relaxed relative z-10 max-w-[95%]">
        Check our interactive guide to get your team up to speed in minutes.
      </p>
      
      <Button className="w-fit h-8 px-4 text-xs font-bold leading-none bg-[#0a1930] text-primary-foreground hover:bg-[#0a1930]/90 border-none shadow-none relative z-10">
        LAUNCH GUIDE
      </Button>
    </Card>
  )
}
