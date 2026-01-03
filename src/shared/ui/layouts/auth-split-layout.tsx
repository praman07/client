import { ReactNode } from 'react'

interface AuthSplitLayoutProps {
  children: ReactNode
  branding?: ReactNode
}

export function AuthSplitLayout({ children, branding }: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Visual Branding Side - Hidden on mobile */}
      <div className="bg-muted hidden lg:flex flex-col justify-between p-10 dark:border-r border-border">
        <div className="flex items-center gap-2 font-medium text-xl">
             <img src="/logo.png" alt="Collabify Logo" className="h-8 w-8 rounded-lg" />
             Collabify
        </div>
        <div className="space-y-4">
             {branding || (
                <blockquote className="space-y-2">
                    <p className="text-lg">
                    "This platform has completely transformed how we manage our engineering workflows. It works exactly how you think it should."
                    </p>
                    <footer className="text-sm text-muted-foreground">Sofia Davis, CTO at Acme Inc</footer>
                </blockquote>
             )}
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
