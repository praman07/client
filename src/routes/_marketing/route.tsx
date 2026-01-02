import { createFileRoute, Outlet, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_marketing')({
  component: MarketingLayout,
})

function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 items-center">
            <span className="font-bold mr-6">Collabify</span>
            <nav className="flex gap-4 text-sm font-medium">
                <Link to="/">Home</Link>
                <Link to="/pricing">Pricing</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </nav>
            <div className="ml-auto">
                <Link to="/sign-in" className="text-sm font-medium hover:underline">Sign In</Link>
            </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        &copy; 2024 Collabify Inc.
      </footer>
    </div>
  )
}
