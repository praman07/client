// widgets/page-list lib types

import { Page } from '@/entities/page'

export interface PageTreeNode {
  page: Page
  children: PageTreeNode[]
}
