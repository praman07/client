import { Menu, X } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion'
import React, { useRef, useState } from 'react'
import { cn } from '@/shared/lib/utils'

interface NavbarProps {
  children: React.ReactNode
  className?: string
}
interface NavBodyProps {
  children: React.ReactNode
  className?: string
  visible?: boolean
}
interface NavItemsProps {
  items: Array<{ name: string; link: string }>
  className?: string
  onItemClick?: () => void
}
interface MobileNavProps {
  children: React.ReactNode
  className?: string
  visible?: boolean
}
interface MobileNavHeaderProps {
  children: React.ReactNode
  className?: string
}
interface MobileNavMenuProps {
  children: React.ReactNode
  className?: string
  isOpen: boolean
  onClose: () => void
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const [visible, setVisible] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > 100)
  })

  return (
    <motion.div
      ref={ref}
      className={cn('fixed inset-x-0 top-4 z-50 w-full', className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  )
}

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? 'blur(12px)' : 'none',
        boxShadow: visible
          ? '0 0 24px rgba(34,42,53,0.08), 0 1px 1px rgba(0,0,0,0.05), 0 0 0 1px rgba(255,255,255,0.06) inset'
          : 'none',
        width: visible ? '52%' : '100%',
        y: visible ? 0 : 0,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 50 }}
      style={{ minWidth: '720px' }}
      className={cn(
        'relative z-60 mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full px-6 py-2.5 lg:flex',
        'bg-transparent dark:bg-transparent',
        visible && 'bg-scrolled dark:bg-scrolled border border-scrolled',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-1 text-14 font-medium lg:flex',
        className,
      )}
    >
      {items.map((item, idx) => (
        <Link
          key={`nav-${idx}`}
          to={item.link}
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 text-secondary hover:text-primary transition-colors duration-200"
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-scrolled-hover dark:bg-scrolled-active"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </Link>
      ))}
    </motion.div>
  )
}

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? 'blur(12px)' : 'none',
        boxShadow: visible
          ? '0 0 24px rgba(34,42,53,0.08), 0 1px 1px rgba(0,0,0,0.05)'
          : 'none',
        width: visible ? '92%' : '100%',
        paddingRight: visible ? '12px' : '0px',
        paddingLeft: visible ? '12px' : '0px',
        borderRadius: visible ? '12px' : '2rem',
        y: visible ? 8 : 0,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 50 }}
      className={cn(
        'relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between px-0 py-2 lg:hidden',
        visible && 'bg-layer-2/80 border border-subtle/20',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => (
  <div className={cn('flex w-full flex-row items-center justify-between', className)}>
    {children}
  </div>
)

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={cn(
          'absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start gap-4 rounded-xl border border-subtle/20 bg-surface-2/95 backdrop-blur-xl px-4 py-6 shadow-overlay-200',
          className,
        )}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
)

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) =>
  isOpen ? (
    <X className="size-5 text-primary cursor-pointer" onClick={onClick} />
  ) : (
    <Menu className="size-5 text-primary cursor-pointer" onClick={onClick} />
  )

export const NavbarButton = ({
  href,
  as: Tag = 'a',
  children,
  className,
  variant = 'primary',
  ...props
}: {
  href?: string
  as?: React.ElementType
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'dark' | 'gradient'
} & (
  | React.ComponentPropsWithoutRef<'a'>
  | React.ComponentPropsWithoutRef<'button'>
)) => {
  const base =
    'px-4 py-2 rounded-full text-14 font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center'

  const variants = {
    primary:
      'bg-accent-primary text-on-color shadow-raised-100 hover:bg-accent-primary-hover',
    secondary:
      'bg-transparent text-primary hover:bg-white/8',
    dark: 'bg-primary text-on-color',
    gradient:
      'bg-linear-to-b from-accent-primary/90 to-accent-primary text-on-color',
  }

  return (
    <Tag
      href={href || undefined}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
