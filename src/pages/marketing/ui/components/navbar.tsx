import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Link } from '@tanstack/react-router'
import { Button, Navbar } from '@/shared/ui'

const NAV_LINKS = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/enterprise', label: 'Enterprise' },
]

export function MarketingNavbar() {
  return (
    <Navbar
      logo={<span>Collabify</span>}
      navigationLinks={NAV_LINKS}
      actions={
        <>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>
        </>
      }
    />
  )
}
