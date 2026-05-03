import { createFileRoute } from '@tanstack/react-router';
import { MarketingPage } from '@/pages/marketing';

export const Route = createFileRoute('/_marketing/')({
  component: MarketingRoute,
});

function MarketingRoute() {
  return <MarketingPage />;
}
