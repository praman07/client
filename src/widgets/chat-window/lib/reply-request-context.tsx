/**
 * Reply Request Context
 *
 * Follows the same pattern as EditRequestProvider.
 * Allows message rows to signal the MessageInput to enter "replying to" mode.
 */
import {  createContext, useContext, useState } from 'react'
import type {ReactNode} from 'react';

interface ReplyTarget {
  id: string
  authorId: string
  content: string
  displayName: string
  contentSnippet: string
}

interface ReplyRequestContextValue {
  replyingTo: ReplyTarget | null
  requestReply: (target: ReplyTarget) => void
  clearReply: () => void
}

const ReplyRequestContext = createContext<ReplyRequestContextValue | null>(null)

export function ReplyRequestProvider({ children }: { children: ReactNode }) {
  const [replyingTo, setReplyingTo] = useState<ReplyTarget | null>(null)

  return (
    <ReplyRequestContext.Provider
      value={{
        replyingTo,
        requestReply: setReplyingTo,
        clearReply: () => setReplyingTo(null),
      }}
    >
      {children}
    </ReplyRequestContext.Provider>
  )
}

export function useReplyRequest() {
  const ctx = useContext(ReplyRequestContext)
  if (!ctx) throw new Error('useReplyRequest must be used inside ReplyRequestProvider')
  return ctx
}
