import { motion } from 'framer-motion'
import { GridPattern } from '@/shared/ui/primitives/grid-pattern'

type Testimonial = {
  name: string
  role: string
  image: string
  company: string
  quote: string
}

// Real Collabify target personas: freelancers, small team leads, solo founders
const testimonials: Array<Testimonial> = [
  {
    quote:
      'I was juggling Notion, Trello, and Slack just to manage one client project. Collabify collapsed all of that into a single workspace. I never want to go back.',
    name: 'Arjun Mehta',
    role: 'Freelance Product Designer',
    company: 'Independent',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    quote:
      'The live whiteboard is insane. My co-founder and I designed our entire MVP architecture together in real time, no lag, no glitches. It just works.',
    name: 'Sophie Laurent',
    role: 'Co-Founder',
    company: 'Launchpad Studio',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    quote:
      'We replaced Linear for issues, Notion for docs, and Slack for chat — all in one week. Our team actually spends less time on tool management now.',
    name: 'Ethan Kim',
    role: 'Engineering Lead',
    company: 'Moonrise Labs',
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
  },
  {
    quote:
      `The flat pricing model is what sold me. I have a team of 8 and I'm paying $29/mo. No per-seat nonsense. No surprise invoices. Just one bill.`,
    name: 'Priya Nair',
    role: 'Operations Manager',
    company: 'CloudStack Co.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    quote:
      'As a solo developer managing multiple client projects, the workspace + vault combo is exactly what I needed. Everything is in one place.',
    name: 'Lucas Fernandez',
    role: 'Freelance Developer',
    company: 'Independent',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
  {
    quote:
      'Saw multiple cursors on our shared whiteboard for the first time and immediately knew this tool was different. Real-time collaboration actually feels real.',
    name: 'Amara Osei',
    role: 'UX Lead',
    company: 'Pixel & Thread',
    image: 'https://randomuser.me/api/portraits/women/29.jpg',
  },
  {
    quote:
      `Finally, a PM tool that doesn't feel like it was designed in 2010. The keyboard shortcuts alone saved me hours every week.`,
    name: 'Tom Ritter',
    role: 'Product Manager',
    company: 'NorthStar SaaS',
    image: 'https://randomuser.me/api/portraits/men/77.jpg',
  },
  {
    quote:
      `I switched from ClickUp and honestly, the speed difference is jarring. Collabify is snappy in a way I haven't felt since Linear.`,
    name: 'Mei Zhang',
    role: 'Startup Founder',
    company: 'HarbourMint',
    image: 'https://randomuser.me/api/portraits/women/53.jpg',
  },
  {
    quote:
      'We use the Pages feature as our internal wiki. It replaced Notion, and having it live next to our Kanban board in the same workspace is a genuine superpower.',
    name: 'Daniel Okonkwo',
    role: 'CTO',
    company: 'Bricc Technologies',
    image: 'https://randomuser.me/api/portraits/men/64.jpg',
  },
  {
    quote:
      'Onboarded my entire remote team in 20 minutes. No training sessions, no tutorial videos. The UX is just intuitive.',
    name: 'Isabelle Morel',
    role: 'Head of Design',
    company: 'Atelier Digital',
    image: 'https://randomuser.me/api/portraits/women/17.jpg',
  },
  {
    quote:
      `Collabify's free tier is insanely generous for solo founders. I built my first SaaS product plan entirely on the free plan before I needed to upgrade.`,
    name: 'Rohan Singh',
    role: 'Indie Hacker',
    company: 'Self-Funded',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    quote:
      'The Vault feature alone is worth it. Storing design assets, docs, and exports all in the same workspace as the project tasks is exactly how it should work.',
    name: 'Clara Bjork',
    role: 'Creative Director',
    company: 'Studio Norden',
    image: 'https://randomuser.me/api/portraits/women/37.jpg',
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative w-full py-24 px-8 md:px-14 lg:px-20">
      {/* Ambient background blobs */}
      <div aria-hidden className="absolute inset-0 isolate z-0 contain-strict">
        <div className="absolute top-0 left-0 h-[320px] w-[140px] -translate-y-[350px] -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,color-mix(in_oklch,var(--foreground)_6%,transparent)_0,color-mix(in_oklch,var(--foreground)_2%,transparent)_50%,color-mix(in_oklch,var(--foreground)_1%,transparent)_80%)]" />
      </div>

      <div className="mx-auto max-w-5xl space-y-8 relative z-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:text-6xl xl:font-extrabold text-foreground">
            Real teams. Real workflows.
          </h2>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
            Freelancers, founders, and small teams who replaced their entire
            tool stack with Collabify.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(({ name, role, company, quote, image }, index) => (
            <motion.div
              initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
              whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * index + 0.05, duration: 0.7 }}
              key={index}
              className="relative grid grid-cols-[auto_1fr] gap-x-3 overflow-hidden border border-dashed border-border/50 p-4 rounded-sm bg-card/20 backdrop-blur-sm hover:bg-card/40 transition-colors duration-300"
            >
              {/* Grid pattern overlay */}
              <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full mask-[linear-gradient(white,transparent)]">
                <div className="absolute inset-0 bg-linear-to-r from-foreground/5 to-foreground/2 mask-[radial-gradient(farthest-side_at_top,white,transparent)]">
                  <GridPattern
                    width={25}
                    height={25}
                    x={-12}
                    y={4}
                    strokeDasharray="3"
                    className="stroke-foreground/20 absolute inset-0 h-full w-full mix-blend-overlay"
                  />
                </div>
              </div>

              <img
                alt={name}
                src={image}
                loading="lazy"
                className="size-9 rounded-full ring-2 ring-border/30"
              />
              <div>
                <div className="-mt-0.5 -space-y-0.5">
                  <p className="text-sm md:text-base font-semibold text-foreground">
                    {name}
                  </p>
                  <span className="text-muted-foreground block text-[11px] font-light tracking-tight">
                    {role} · {company}
                  </span>
                </div>
                <blockquote className="mt-3">
                  <p className="text-foreground/80 text-sm font-light tracking-wide leading-relaxed">
                    {quote}
                  </p>
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
