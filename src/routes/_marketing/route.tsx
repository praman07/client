import { useState } from 'react';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@clerk/clerk-react';
import { MarketingFooter } from '@/pages/marketing';
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  NavItems,
  Navbar,
} from '@/shared/ui/primitives/resizable-navbar';

export const Route = createFileRoute('/_marketing')({
  component: MarketingLayout,
});

const navItems = [
  { name: 'Features', link: '/features/chat' },
  { name: 'Pricing', link: '/pricing' },
  { name: 'Changelog', link: '/changelog' },
  { name: 'Compare', link: '/compare/slack' },
];

// Reusable button style helpers — avoids NavbarButton as={Link} TS union issue
const btnPrimary =
  'px-4 py-2 rounded-full text-sm font-bold bg-foreground text-background hover:-translate-y-0.5 transition duration-200 hover:bg-foreground/90';
const btnSecondary =
  'px-4 py-2 rounded-full text-sm font-bold bg-transparent text-foreground hover:-translate-y-0.5 transition duration-200 hover:bg-white/8';

function MarketingNavbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop */}
      <NavBody>
        <Link
          to="/"
          className="relative z-20 flex items-center gap-2 font-black text-xl tracking-tighter text-foreground mr-4 shrink-0"
        >
          <span className="text-2xl leading-none">❖</span>
          Collabify
        </Link>

        <NavItems items={navItems} />

        <div className="relative z-20 flex items-center gap-2 shrink-0">
          {!isLoaded ? (
            <div className="w-24 h-9 bg-white/10 animate-pulse rounded-full" />
          ) : isSignedIn ? (
            <Link to="/home" className={btnPrimary}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/sign-in" className={btnSecondary}>
                Log in
              </Link>
              <Link to="/sign-up" className={btnPrimary}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile */}
      <MobileNav>
        <MobileNavHeader>
          <Link
            to="/"
            className="flex items-center gap-2 font-black text-xl tracking-tighter text-foreground"
          >
            <span className="text-2xl leading-none">❖</span>
            Collabify
          </Link>
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((o) => !o)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <Link
              key={`mob-${idx}`}
              to={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-foreground/70 hover:text-foreground transition-colors font-medium"
            >
              {item.name}
            </Link>
          ))}

          <div className="flex w-full flex-col gap-3 pt-2 border-t border-border/20">
            {isSignedIn ? (
              <Link
                to="/home"
                className={`${btnPrimary} w-full text-center`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className={`${btnSecondary} w-full text-center border border-border/30`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/sign-up"
                  className={`${btnPrimary} w-full text-center`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

function MarketingLayout() {
  return (
    <div className="dark marketing-dark relative flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-primary/30">
      <div className="fixed top-0 left-0 right-0 h-[600px] w-full bg-linear-to-b from-white/5 via-transparent to-transparent pointer-events-none -z-10" />

      <MarketingNavbar />
      <main className="flex-1 relative z-10 w-full overflow-hidden flex flex-col pt-20">
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  );
}
