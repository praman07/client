import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  navigationMenuTriggerStyle } from '@/shared/ui'
import { cn } from '@/shared/lib/utils'

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  navigationLinks?: Array<{ label: string; href: string }>
  actions?: React.ReactNode
}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, logo, navigationLinks = [], actions, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <header
        ref={ref}
        className={cn(
          'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60',
          className,
        )}
        {...props}
      >
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2 font-bold">
              {logo}
            </Link>
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navigationLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <Link
                      to={link.href}
                      className={navigationMenuTriggerStyle()}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">{actions}</div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                }
              />
              <SheetContent side="left" className="pr-0">
                <SheetHeader>
                  <SheetTitle className="text-left font-bold">
                    {logo}
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="mt-4 flex flex-col gap-2">{actions}</div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    )
  },
)
Navbar.displayName = 'Navbar'
