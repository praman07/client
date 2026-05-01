import { ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { FlickeringGrid } from '@/shared/ui/primitives/flickering-grid'


const footerLinks = [
  {
    title: 'Product',
    links: [
      { id: 1, title: 'Features', url: '/features/chat' },
      { id: 2, title: 'Pricing', url: '/pricing' },
      { id: 3, title: 'Changelog', url: '/changelog' },
      { id: 4, title: 'Roadmap', url: '/changelog' },
    ],
  },
  {
    title: 'Compare',
    links: [
      { id: 5, title: 'vs Slack', url: '/compare/slack' },
      { id: 6, title: 'vs Notion', url: '/compare/slack' },
      { id: 7, title: 'vs Jira', url: '/compare/slack' },
      { id: 8, title: 'vs ClickUp', url: '/compare/slack' },
    ],
  },
  {
    title: 'Company',
    links: [
      { id: 9, title: 'About', url: '/about' },
      { id: 10, title: 'Contact', url: '/contact' },
      { id: 11, title: 'Privacy', url: '/about' },
      { id: 12, title: 'Terms', url: '/about' },
    ],
  },
]

function useMediaQuery(query: string) {
  const [value, setValue] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = () => setValue(mq.matches)
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return value
}

export function MarketingFooter() {
  const isTablet = useMediaQuery('(max-width: 1024px)')

  return (
    <footer className="w-full pb-0 border-t border-border/20 mt-16 relative z-20">
      {/* Top section: logo + links */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between p-10 gap-10">
        {/* Brand */}
        <div className="flex flex-col items-start gap-y-5 max-w-xs">
          <Link to="/" className="flex items-center gap-2 font-black text-20 tracking-tighter">
            <span className="text-primary text-24 leading-none">❖</span>
            <span className="text-primary">Collabify</span>
          </Link>
          <p className="text-14 text-tertiary leading-relaxed">
            Replace Slack, Jira, and Notion with one real-time platform. Chat,
            plan, draw, and ship together — for free.
          </p>
          {/* SOC2 / trust badges placeholder — shown at correct size */}
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-tertiary/60 font-semibold">
            <span className="border border-border/40 rounded px-2 py-1">SOC2</span>
            <span className="border border-border/40 rounded px-2 py-1">GDPR</span>
            <span className="border border-border/40 rounded px-2 py-1">HIPAA</span>
          </div>
        </div>

        {/* Links */}
        <div className="md:w-1/2">
          <div className="flex flex-col md:flex-row gap-8 md:justify-between lg:pl-10">
            {footerLinks.map((column, colIdx) => (
              <ul key={colIdx} className="flex flex-col gap-y-2 min-w-[120px]">
                <li className="mb-2 text-12 font-bold uppercase tracking-widest text-primary/50">
                  {column.title}
                </li>
                {column.links.map((link) => (
                  <li
                    key={link.id}
                    className="group inline-flex cursor-pointer items-center gap-1 text-14 text-tertiary hover:text-primary transition-colors duration-200"
                  >
                    <Link to={link.url}>{link.title}</Link>
                    <div className="flex size-4 items-center justify-center border border-border/40 rounded translate-x-0 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* Flickering grid text banner */}
      <div className="w-full h-56 md:h-72 relative mt-8 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-transparent to-background z-10 from-40%" />
        <div
          className="absolute bottom-0 inset-x-0"
          style={{ height: isTablet ? 160 : 230 }}
        >
          <FlickeringGrid
            text={'Collabifyy'}
            fontSize={isTablet ? 140 : 200}
            className="h-full w-full"
            squareSize={2}
            gridGap={isTablet ? 2 : 3}
            color="#6B7280"
            maxOpacity={0.35}
            flickerChance={0.08}
          />
        </div>
      </div>
    </footer>
  )
}
