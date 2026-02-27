import { PageEditor } from '@/widgets/page-editor'

/**
 * Pages editor page — mounts the full collaborative PageEditor widget.
 * Replaces the previous stub component.
 *
 * @layer Pages
 */
export function PagesEditorPage({ pageId }: { pageId: string }) {
  return <PageEditor pageId={pageId} />
}
