import { createFileRoute } from '@tanstack/react-router';
import { GenericMarketingPage } from '@/pages/marketing';

export const Route = createFileRoute('/_marketing/features/chat')({
  component: () => (
    <GenericMarketingPage 
      category="Feature Deep Dive"
      title="Real-Time Chat Context" 
      subtitle="Context-aware chat channels that live directly inside your projects. Stop context switching to Slack." 
    />
  ),
});
