import { ReactNode } from 'react'
import { Check, Shield, Zap } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar'

interface AuthSplitLayoutProps {
  children: ReactNode
}

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Visual Branding Side - Hidden on mobile */}
      <div className="relative hidden h-full flex-col bg-zinc-950 p-10 text-white dark:border-r lg:flex">
        {/* Logo */}
        <div className="relative z-20 flex items-center text-lg font-bold tracking-tight">
          <img src="/logo.png" alt="Collabify" className="mr-2 h-8 w-8" />
          Collabify
        </div>

        {/* Content */}
        <div className="relative z-20 mx-auto flex flex-col justify-center h-full max-w-lg space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    Join 10 million+ users collaborating seamlessly
                </h1>
                <p className="text-lg text-zinc-400">
                    Unify your team’s workflow with docs, tasks, chat, meetings, and files in one powerful platform.
                </p>
            </div>

            <div className="space-y-8">
                <div className="flex gap-4">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white">
                        <Check className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold leading-none">Real-time collaboration</h3>
                        <p className="text-sm text-zinc-400">Work together with your team in real-time across all modules</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white">
                        <Shield className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold leading-none">Enterprise-grade security</h3>
                        <p className="text-sm text-zinc-400">Advanced permissions and SSO support for complete control</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white">
                        <Zap className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold leading-none">AI-powered assistance</h3>
                        <p className="text-sm text-zinc-400">Oracle AI helps you work smarter with context-aware insights</p>
                    </div>
                </div>
            </div>

             {/* Social Proof */}
             <div className="space-y-4 pt-8">
                <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Avatar key={i} className="border-2 border-zinc-950 h-8 w-8 grayscale ring-0">
                             <AvatarImage src={`https://i.pravatar.cc/100?u=${i}`} />
                             <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                    ))}
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-400">Trusted by teams at</p>
                    <p className="text-sm font-semibold text-white">Google, Microsoft, Stripe & more</p>
                </div>
            </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-md">
            {children}
        </div>
      </div>
    </div>
  )
}
