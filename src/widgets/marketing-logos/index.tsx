
export function MarketingLogos() {
  const logos = [
    { name: 'Acme Corp', initial: 'AC' },
    { name: 'Global Tech', initial: 'GT' },
    { name: 'NextGen', initial: 'NG' },
    { name: 'Starlight', initial: 'SL' },
    { name: 'Umbrella', initial: 'UM' },
    { name: 'Cyberdyne', initial: 'CY' },
  ]

  return (
    <section className="py-12 md:py-16 lg:py-24 border-b">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <p className="text-center text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted by innovative teams worldwide
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo) => (
            <div key={logo.name} className="flex items-center gap-2 font-bold text-xl">
                 <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center text-primary text-xs">
                    {logo.initial}
                 </div>
                 <span>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
