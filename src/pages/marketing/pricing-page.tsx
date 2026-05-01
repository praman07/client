export function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-24 text-center relative z-10">
      <h1 className="text-40 font-extrabold tracking-tight text-primary sm:text-7xl drop-shadow-raised-100">
        Pricing that scales with your ambition.
      </h1>
      <p className="mt-6 text-20 text-tertiary max-w-2xl mx-auto font-medium">
        Zero per-seat billing. Pay one flat rate and collaborate with your entire team.
      </p>
      
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder for the 4 Tier Cards */}
        <div className="p-8 border border-border/50 rounded-2xl bg-card/40 backdrop-blur-sm shadow-overlay-200 flex flex-col items-center">
            <h3 className="text-24 font-bold">Starter</h3>
            <p className="mt-2 text-32 font-extrabold">$0</p>
        </div>
        <div className="p-8 border-2 border-primary rounded-2xl bg-primary/5 backdrop-blur-sm shadow-overlay-200 flex flex-col items-center relative transform lg:-translate-y-4">
            <div className="absolute -top-4 bg-primary text-on-color px-4 py-1 rounded-full text-14 font-bold tracking-wider uppercase shadow-overlay-100">Most Popular</div>
            <h3 className="text-24 font-bold text-primary">Solo</h3>
            <p className="mt-2 text-32 font-extrabold">$8</p>
        </div>
        <div className="p-8 border border-border/50 rounded-2xl bg-card/40 backdrop-blur-sm shadow-overlay-200 flex flex-col items-center">
            <h3 className="text-24 font-bold">Squad</h3>
            <p className="mt-2 text-32 font-extrabold">$29</p>
        </div>
        <div className="p-8 border border-border/50 rounded-2xl bg-card/40 backdrop-blur-sm shadow-overlay-200 flex flex-col items-center">
            <h3 className="text-24 font-bold">Power</h3>
            <p className="mt-2 text-32 font-extrabold">$89</p>
        </div>
      </div>
    </div>
  );
}
