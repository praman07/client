import { Link } from '@tanstack/react-router'
import { Separator } from '@/shared/ui/primitives/separator'

export function MarketingFooter() {
  const links = {
    product: [
      { label: 'Features', href: '#' },
      { label: 'Integrations', href: '#' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog', href: '#' },
      { label: 'Docs', href: '#' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '/contact' },
      { label: 'Partners', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  }

  return (
    <footer className="bg-muted/10 py-12 md:py-16">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <Link
              to="/"
              className="text-xl font-bold flex items-center gap-2 mb-4"
            >
              Collabify
            </Link>
            <p className="text-muted-foreground max-w-xs mb-6">
              The all-in-one collaboration platform designed for modern product
              teams. Built for speed, reliability, and scale.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold">Product</h4>
            {links.product.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-semibold">Company</h4>
            {links.company.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold">Legal</h4>
            {links.legal.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Collabify Inc. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            {/* Social icons placeholder */}
            <span className="cursor-pointer hover:text-primary">Twitter</span>
            <span className="cursor-pointer hover:text-primary">GitHub</span>
            <span className="cursor-pointer hover:text-primary">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
