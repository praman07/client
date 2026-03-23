import { createFileRoute } from '@tanstack/react-router';
import { GenericMarketingPage } from '@/pages/marketing';

export const Route = createFileRoute('/_marketing/contact')({
  component: () => (
    <GenericMarketingPage 
      category="Get In Touch"
      title="Contact Sales & Sponsorships" 
      subtitle="Looking to sponsor Collabify or need an Enterprise grid? Let's talk." 
    />
  ),
});
