import { Link } from '@tanstack/react-router'
import type { LinkProps } from '@tanstack/react-router'

interface NavItem {
  label: string
  href: LinkProps['to']
  activeOptions?: { exact?: boolean }
}

interface NavTabsProps {
  items: Array<NavItem>
  from?: LinkProps['from']
}

export function NavTabs({ items, from }: NavTabsProps) {
  return (
    <nav className="flex items-center gap-6 overflow-x-auto overflow-y-hidden">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href as any}
          from={from}
          activeOptions={item.activeOptions}
          className="group relative flex h-12 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          activeProps={{
            className: 'text-foreground font-semibold',
          }}
        >
          {({ isActive }) => (
            <>
              {item.label}
              {isActive && (
                <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-foreground transition-all" />
              )}
            </>
          )}
        </Link>
      ))}
    </nav>
  )
}
