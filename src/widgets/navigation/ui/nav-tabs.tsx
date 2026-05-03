import { Link } from '@tanstack/react-router'

interface NavItem {
  label: string
  href: string
  activeOptions?: { exact?: boolean }
}

interface NavTabsProps {
  items: Array<NavItem>
  from?: string
}

export function NavTabs({ items, from }: NavTabsProps) {
  return (
    <div className="w-full shrink-0 border-b border-subtle bg-surface-1 px-6">
      <nav className="flex items-center gap-6 overflow-x-auto overflow-y-hidden">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href as any}
          from={from as any}
          activeOptions={item.activeOptions}
          className="group relative flex h-12 items-center text-13 font-medium text-secondary hover:text-primary transition-colors duration-100"
          activeProps={{
            className: 'text-primary font-semibold',
          }}
        >
          {({ isActive }) => (
            <>
              <span className="pb-0.5">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-accent-primary transition-all" />
              )}
            </>
          )}
        </Link>
      ))}
      </nav>
    </div>
  )
}
