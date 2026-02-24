/**
 * Pages Event Consolidation — combines upstream + downstream into one namespace.
 * @layer Shared
 */

import { PageUpstreamEvent } from './upstream'
import { PageDownstreamEvent } from './downstream'

export { PageUpstreamEvent, PageDownstreamEvent }
export * from './upstream'
export * from './downstream'

export const PageEvent = {
  ...PageUpstreamEvent,
  ...PageDownstreamEvent,
} as const

export type PageEvent = PageUpstreamEvent | PageDownstreamEvent
