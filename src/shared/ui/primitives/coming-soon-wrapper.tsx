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
    <div className={cn("relative overflow-hidden group rounded-[inherit] border border-transparent transition-all", className)} {...props}>
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/10 backdrop-blur-[1px] cursor-not-allowed transition-all duration-500 rounded-[inherit]">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/20 rounded-[inherit]" />
        
        <div className="relative z-10 flex items-center gap-2 bg-popover/80 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md border border-border/50 text-foreground px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-transform duration-300 group-hover:scale-105 hardware-accelerated">
          <Lock className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="bg-linear-to-r from-foreground/80 to-foreground bg-clip-text text-transparent">
            {label}
          </span>
        </div>
      </div>
      
      <div 
        className="opacity-70 grayscale-30 pointer-events-none select-none transition-all duration-500 group-hover:opacity-50 group-hover:grayscale-50" 
        {...({ inert: "" } as any)}
      >
        {children}
      </div>
    </div>
  )
}
