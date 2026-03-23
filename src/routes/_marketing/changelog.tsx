import { createFileRoute } from '@tanstack/react-router';
import { ChangelogPage } from '@/pages/marketing';

export const Route = createFileRoute('/_marketing/changelog')({
  component: ChangelogPage,
});
