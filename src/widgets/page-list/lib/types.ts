// widgets/page-list lib types

import type { Page } from '@/entities/page'

export interface PageTreeNode {
  page: Page
  children: Array<PageTreeNode>
}
