import React from 'react'
import { Lock } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export interface ComingSoonWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  label?: string
}

export function ComingSoonWrapper({
  children,
  label = 'Coming Soon',
  className,
  ...props
}: ComingSoonWrapperProps) {
  return (
    <div
      className={cn('relative overflow-hidden group rounded-[inherit] border border-transparent transition-colors duration-100', className)}
      {...props}
    >
      {/* Overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-layer-transparent/10 backdrop-blur-[1px] cursor-not-allowed transition-all duration-300 rounded-[inherit]">
        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-canvas/20 rounded-[inherit]" />

        {/* Badge */}
        <div className="relative z-10 flex items-center gap-2 bg-surface-2/90 shadow-overlay-100 backdrop-blur-md border border-subtle text-primary px-4 py-2 rounded-full text-11 font-semibold tracking-widest uppercase transition-transform duration-200 group-hover:scale-105 hardware-accelerated">
          <Lock className="size-3.5 text-tertiary group-hover:text-secondary transition-colors duration-100" />
          <span className="bg-linear-to-r from-secondary to-primary bg-clip-text text-transparent">
            {label}
          </span>
        </div>
      </div>

      {/* Blurred content */}
      <div
        className="opacity-70 grayscale-30 pointer-events-none select-none transition-all duration-300 group-hover:opacity-50 group-hover:grayscale-50"
        {...({ inert: '' } as any)}
      >
        {children}
      </div>
    </div>
  )
}
