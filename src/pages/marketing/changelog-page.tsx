export function ChangelogPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl relative z-10">
      <div className="text-center mb-16">
        <h1 className="text-40 font-extrabold tracking-tight text-primary sm:text-40 drop-shadow-raised-100">
          Changelog
        </h1>
        <p className="mt-6 text-20 text-tertiary font-medium">
          New updates, improvements, and fixes shipped every week.
        </p>
      </div>
      
      {/* Placeholder Feed */}
      <div className="space-y-12">
        <div className="relative pl-8 border-l-2 border-border/50">
            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background bg-primary shadow-raised-100" />
            <span className="text-14 font-bold text-primary mb-2 block uppercase tracking-wider">v1.0.0 &middot; Today</span>
            <h3 className="text-24 font-bold text-primary">The 4-Tier Pricing Engine goes live.</h3>
            <p className="mt-2 text-tertiary">We entirely refactored the billing engine to support flat-rate plans. You can now invite infinite users without worrying about per-seat costs.</p>
        </div>
      </div>
    </div>
  );
}
