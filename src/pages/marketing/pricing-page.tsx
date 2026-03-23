export function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-24 text-center relative z-10">
      <h1 className="text-6xl font-extrabold tracking-tight text-foreground sm:text-7xl drop-shadow-sm">
        Pricing that scales with your ambition.
      </h1>
      <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
        Zero per-seat billing. Pay one flat rate and collaborate with your entire team.
      </p>
      
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder for the 4 Tier Cards */}
        <div className="p-8 border border-border/50 rounded-2xl bg-card/40 backdrop-blur-sm shadow-xl flex flex-col items-center">
            <h3 className="text-2xl font-bold">Starter</h3>
            <p className="mt-2 text-4xl font-extrabold">$0</p>
        </div>
        <div className="p-8 border-2 border-primary rounded-2xl bg-primary/5 backdrop-blur-sm shadow-2xl flex flex-col items-center relative transform lg:-translate-y-4">
            <div className="absolute -top-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase shadow-lg">Most Popular</div>
            <h3 className="text-2xl font-bold text-primary">Solo</h3>
            <p className="mt-2 text-4xl font-extrabold">$8</p>
        </div>
        <div className="p-8 border border-border/50 rounded-2xl bg-card/40 backdrop-blur-sm shadow-xl flex flex-col items-center">
            <h3 className="text-2xl font-bold">Squad</h3>
            <p className="mt-2 text-4xl font-extrabold">$29</p>
        </div>
        <div className="p-8 border border-border/50 rounded-2xl bg-card/40 backdrop-blur-sm shadow-xl flex flex-col items-center">
            <h3 className="text-2xl font-bold">Power</h3>
            <p className="mt-2 text-4xl font-extrabold">$89</p>
        </div>
      </div>
    </div>
  );
}
