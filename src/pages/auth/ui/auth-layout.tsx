import type { ReactNode } from 'react'

interface AuthSplitLayoutProps {
  children: ReactNode
}

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Visual Branding Side */}
      <div className="relative hidden h-full flex-col bg-surface-1 p-10 lg:flex">
        {/* Logo */}
        <div className="relative z-20 flex items-center text-18 font-bold tracking-tight text-primary">
          <span className="mr-2 h-8 w-8 rounded-lg bg-accent-primary flex items-center justify-center">
            <span className="text-on-color text-14 font-bold">C</span>
          </span>
          Collabifyy
        </div>

        {/* Content */}
        <div className="relative z-20 mx-auto flex flex-col justify-center h-full max-w-lg space-y-8">
          <div className="space-y-3">
            <h1 className="text-28 font-semibold tracking-tight text-primary">
              Where work comes together
            </h1>
            <p className="text-14 text-secondary leading-relaxed">
              Docs, tasks, chat, and files connected in one workspace.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              'Real-time collaboration across all modules',
              'Streamline workflows and boost team productivity',
              'Designed for modern, fast-moving teams',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0 text-accent-primary text-14">•</span>
                <span className="text-14 text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-6 md:p-10 bg-surface-1">
        <div className="w-full max-w-sm md:max-w-md">{children}</div>
      </div>
    </div>
  )
}
