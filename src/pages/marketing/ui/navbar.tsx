import { useEffect, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useAuth } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const NAV_ITEMS = [{ label: 'Changelog', to: '/changelog' }] as const;

export function MarketingNavbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-200',
        scrolled
          ? 'shadow-sm bg-surface-1/90 backdrop-blur-lg'
          : 'bg-transparent',
      )}
    >
      <div className="relative mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6">

        {/* ── Logo ── */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 font-heading text-15 font-semibold text-primary"
        >
          {/* Wordmark badge */}
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-primary text-13 font-bold text-on-color tracking-tight">
            C
          </span>
          <span className="tracking-tight">Collabify</span>
        </Link>

        {/* ── Desktop nav links ── */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex">
          {NAV_ITEMS.map(({ label, to }) => {
            const isActive = currentPath === to || currentPath.startsWith(to + '/');
            return (
              <Link
                key={label}
                to={to}
                className={cn(
                  'rounded-md px-3.5 py-1.5 text-14 font-medium transition-colors duration-150',
                  isActive
                    ? 'text-primary bg-layer-1'
                    : 'text-secondary hover:text-primary hover:bg-layer-1',
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop actions ── */}
        <div className="hidden shrink-0 items-center gap-1 lg:flex">
          {!isLoaded ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-layer-1" />
          ) : isSignedIn ? (
            <Link
              to="/home"
              className="inline-flex h-9 items-center rounded-md bg-accent-primary px-4 text-13 font-semibold text-on-color transition-opacity duration-150 hover:opacity-90"
            >
              Open workspace
            </Link>
          ) : (
            <>
              {/* Ghost — Sign in */}
              <Link
                to="/sign-in"
                className="inline-flex h-9 items-center rounded-md px-4 text-13 font-medium text-secondary transition-colors duration-150 hover:bg-layer-1 hover:text-primary"
              >
                Sign in
              </Link>

              {/* Divider */}
              <span className="mx-1 h-4 w-px bg-strong opacity-40" aria-hidden />

              {/* Filled — Get started */}
              <Link
                to="/sign-up"
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-accent-primary px-4 text-13 font-semibold text-on-color transition-opacity duration-150 hover:opacity-90"
              >
                Get started
                <span className="opacity-70">→</span>
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile toggle ── */}
        <button
          type="button"
          className="flex items-center justify-center rounded-md p-1.5 text-secondary transition-colors hover:bg-layer-1 hover:text-primary lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="border-t border-subtle bg-surface-1 px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-14 font-medium text-secondary hover:bg-layer-1 hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex flex-col gap-2 border-t border-subtle pt-3">
            {isSignedIn ? (
              <Link
                to="/home"
                onClick={() => setMobileOpen(false)}
                className="flex h-10 items-center justify-center rounded-md bg-accent-primary text-14 font-semibold text-on-color"
              >
                Open workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 items-center justify-center rounded-md border border-strong text-14 font-medium text-primary hover:bg-layer-1"
                >
                  Sign in
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 items-center justify-center rounded-md bg-accent-primary text-14 font-semibold text-on-color"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}