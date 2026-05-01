interface GenericMarketingPageProps {
  title: string;
  subtitle: string;
  category: string;
}

export function GenericMarketingPage({ title, subtitle, category }: GenericMarketingPageProps) {
  return (
    <div className="container mx-auto px-4 py-24 text-center relative z-10">
      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-12 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-6 uppercase tracking-widest">
        {category}
      </div>
      <h1 className="text-32 font-extrabold tracking-tight text-primary sm:text-40 drop-shadow-raised-100">
        {title}
      </h1>
      <p className="mt-6 text-20 text-tertiary max-w-2xl mx-auto font-medium">
        {subtitle}
      </p>
      
      {/* Placeholder Content Blocks */}
      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        <div className="h-64 rounded-xl border border-border/50 bg-card/20 backdrop-blur-sm" />
        <div className="h-64 rounded-xl border border-border/50 bg-card/20 backdrop-blur-sm" />
      </div>
    </div>
  );
}
