import { Outlet, createFileRoute } from '@tanstack/react-router';
import { MarketingNavbar } from '@/pages/marketing/ui/navbar';
import { cn } from '@/shared/lib/utils';

export const Route = createFileRoute('/_marketing')({
  component: MarketingLayout,
});

function MarketingLayout() {
  return (
    <div className={cn('dark relative flex min-h-screen flex-col bg-surface-1 font-sans text-primary selection:bg-accent-subtle')}>
      <MarketingNavbar />
      <main className="relative z-10 flex w-full flex-1 flex-col pt-16">
        <Outlet />
      </main>
    </div>
  );
}