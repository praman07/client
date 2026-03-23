import { createFileRoute } from '@tanstack/react-router';
import { GenericMarketingPage } from '@/pages/marketing';

export const Route = createFileRoute('/_marketing/about')({
  component: () => (
    <GenericMarketingPage 
      category="Company"
      title="Built for the builders." 
      subtitle="We got tired of paying $300/mo for 4 different apps that didn't talk to each other. Collabify is our answer." 
    />
  ),
});
