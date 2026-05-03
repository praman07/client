import { ChangelogPage } from '@/pages/marketing/ui/changelog-page';
import { createFileRoute } from '@tanstack/react-router';
 
export const Route = createFileRoute('/_marketing/changelog')({
  component: ChangelogRoute,
});

function ChangelogRoute() {
  return <ChangelogPage />;
}
