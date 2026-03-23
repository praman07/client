import { createFileRoute } from '@tanstack/react-router';
import { GenericMarketingPage } from '@/pages/marketing';

export const Route = createFileRoute('/_marketing/compare/slack')({
  component: () => (
    <GenericMarketingPage 
      category="Alternative To..."
      title="Why teams are leaving Slack." 
      subtitle="Chat without action items is just noise. See how Collabify turns conversations directly into Kanban issues." 
    />
  ),
});
