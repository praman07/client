/**
 * Register all page WS event handlers with the event bus.
 * Returns a cleanup function — called when the WS domain plugin is destroyed.
 *
 * @layer Features
 */

import { registerHandler } from '@/shared/ws/event-bus'
import { PageDownstreamEvent } from '@/shared/contracts/pages'
import type {
  SubscribeSuccessPayload,
  PageUpdateBroadcastPayload,
  UpdateAckPayload,
  UserJoinedPayload,
  UserLeftPayload,
  AwarenessUpdateBroadcastPayload,
} from '@/shared/contracts/pages'
import type { PageEventHandlerContext } from '../model'
import {
  handleSubscribeSuccess,
  handlePageUpdate,
  handleUpdateAck,
  handleUserJoined,
  handleUserLeft,
  handleAwarenessUpdate,
} from './handlers'

export function registerPageHandlers(
  context: PageEventHandlerContext,
): () => void {
  const cleanups: Array<() => void> = []

  cleanups.push(
    registerHandler(PageDownstreamEvent.SubscribeSuccess, (event) => {
      handleSubscribeSuccess(event.payload as SubscribeSuccessPayload, context)
    }),
  )

  cleanups.push(
    registerHandler(PageDownstreamEvent.PageUpdate, (event) => {
      const payload = event.payload as PageUpdateBroadcastPayload
      handlePageUpdate(payload, context)
    }),
  )

  cleanups.push(
    registerHandler(PageDownstreamEvent.UpdateAck, (event) => {
      handleUpdateAck(event.payload as UpdateAckPayload, context)
    }),
  )

  cleanups.push(
    registerHandler(PageDownstreamEvent.UserJoined, (event) => {
      handleUserJoined(event.payload as UserJoinedPayload, context)
    }),
  )

  cleanups.push(
    registerHandler(PageDownstreamEvent.UserLeft, (event) => {
      handleUserLeft(event.payload as UserLeftPayload, context)
    }),
  )

  cleanups.push(
    registerHandler(PageDownstreamEvent.AwarenessUpdate, (event) => {
      const payload = event.payload as AwarenessUpdateBroadcastPayload & {
        pageId?: string
      }
      // pageId is available in the event envelope — pass through
      handleAwarenessUpdate(payload, context, payload.pageId ?? '')
    }),
  )

  return () => cleanups.forEach((fn) => fn())
}
