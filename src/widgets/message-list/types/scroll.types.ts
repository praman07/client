import type { Virtualizer } from '@tanstack/react-virtual'

export interface ScrollIntent {
  type: 'JUMP_TO_BOTTOM' | 'MAINTAIN_POSITION' | 'SCROLL_TO_INDEX'
  targetIndex?: number
  align?: 'start' | 'end' | 'center' | 'auto'
}

export interface MessageListController {
  virtualizer: Virtualizer<HTMLDivElement, Element>
  isAtBottom: boolean
  hasNewMessages: boolean
  scrollToBottom: () => void
}
