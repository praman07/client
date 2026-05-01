import { Link } from '@tanstack/react-router';
import { FileText } from 'lucide-react';
import { usePagesHome } from '@/features/pages/fetch-pages-home';
import { useCreatePageModal } from '@/features/pages/create-page';
import type { GetPagesHomeQuery } from '@/gql/graphql';

type PageItem = GetPagesHomeQuery['getPagesHome']['pages'][number];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString();
}

// ── Loading Skeleton ──────────────────────────────────────────────────────────

function PageCardSkeleton() {
  return (
    <div className="bg-layer-1 border border-subtle rounded-lg p-3 animate-fade-in-in">
      <div className="h-8 flex items-center justify-center mb-2">
        <div className="size-8 bg-layer-2 animate-pulse-subtle rounded-md" />
      </div>
      <div className="space-y-1.5 mb-2">
        <div className="h-4 bg-layer-2 animate-pulse-subtle rounded-md w-3/4 mx-auto" />
        <div className="h-4 bg-layer-2 animate-pulse-subtle rounded-md w-1/2 mx-auto" />
      </div>
      <div className="flex justify-center gap-1">
        <div className="h-3 bg-layer-2 animate-pulse-subtle rounded w-16" />
        <div className="h-3 bg-layer-2 animate-pulse-subtle rounded w-12" />
      </div>
    </div>
  );
}

function LoadingView() {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-8">
      <div className="mb-6 text-center">
        <div className="h-7 bg-layer-1 animate-pulse-subtle rounded-md w-40 mx-auto" />
      </div>
      <div className="w-full max-w-xl mx-auto">
        <div className="h-4 bg-layer-2 animate-pulse-subtle rounded w-28 mb-3" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <PageCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page Card ─────────────────────────────────────────────────────────────────

interface PageCardProps {
  page: PageItem;
  workspaceSlug: string;
  projectSlug: string;
}

function PageCard({ page, workspaceSlug, projectSlug }: PageCardProps) {
  return (
    <Link
      to="/workspace/$workspaceSlug/project/$projectSlug/pages/$pageId"
      params={{ workspaceSlug, projectSlug, pageId: page.id }}
      className="group w-full text-left bg-layer-1 hover:bg-layer-1-hover border border-subtle rounded-lg p-3 cursor-pointer transition-colors duration-100 active:scale-[0.99] hardware-accelerated block"
    >
      {/* Emoji header */}
      <div className="h-10 flex items-center justify-center mb-3">
        <span className="text-24 select-none">{page.emojiIcon ?? '📄'}</span>
      </div>

      {/* Title */}
      <div className="font-medium text-13 text-primary line-clamp-2 mb-2 min-h-10 leading-snug">
        {page.title || 'Untitled'}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-1.5 text-11 text-secondary">
        <span>{formatDate(page.updatedAt)}</span>
        <span>·</span>
        <span className="truncate">{page.createdByName ?? 'Unknown'}</span>
      </div>
    </Link>
  );
}

// ── Pages Section ─────────────────────────────────────────────────────────────

interface PagesSectionProps {
  title: string;
  pages: PageItem[];
  workspaceSlug: string;
  projectSlug: string;
}

function PagesSection({ title, pages, workspaceSlug, projectSlug }: PagesSectionProps) {
  if (pages.length === 0) return null;

  return (
    <section className="w-full">
      <h2 className="text-13 font-medium text-secondary mb-3">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {pages.map((p) => (
          <PageCard key={p.id} page={p} workspaceSlug={workspaceSlug} projectSlug={projectSlug} />
        ))}
      </div>
    </section>
  );
}

// ── Greeting ──────────────────────────────────────────────────────────────────

function Greeting() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return (
    <div className="mb-8 text-center">
      <h1 className="text-20 font-semibold text-primary tracking-tight">{greeting}</h1>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState() {
  const { open } = useCreatePageModal();

  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
      <div className="bg-layer-1 border border-subtle rounded-full p-5 mb-4">
        <FileText className="size-10 text-tertiary" />
      </div>
      <h3 className="text-18 font-semibold text-primary tracking-tight mb-1.5">
        No pages yet
      </h3>
      <p className="text-13 text-secondary max-w-xs mb-5">
        Create your first page to get started.
      </p>
      <button
        onClick={() => open({ parentId: null })}
        className="bg-accent-primary hover:bg-accent-primary-hover text-on-color rounded-md px-3 py-1.5 text-13 font-medium active:scale-[0.99] transition-all duration-100 hardware-accelerated"
      >
        Create a page
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface PagesIndexPageProps {
  workspaceSlug: string;
  projectSlug: string;
}

/**
 * Pages home page — shown at /workspace/$workspaceSlug/project/$projectSlug/pages/
 *
 * Displays recently updated pages as a grid.
 * Route params are passed in from the route boundary component.
 *
 * @layer Pages
 */
export function PagesIndexPage({ workspaceSlug, projectSlug }: PagesIndexPageProps) {
  const { data, isLoading } = usePagesHome(10);

  if (isLoading) return <LoadingView />;

  const pages = data?.getPagesHome?.pages ?? [];

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-8 scrollbar-sm">
      <Greeting />

      {pages.length === 0 ? (
        <EmptyState />
      ) : (
        <PagesSection
          title="Recent Pages"
          pages={pages}
          workspaceSlug={workspaceSlug}
          projectSlug={projectSlug}
        />
      )}
    </div>
  );
}
