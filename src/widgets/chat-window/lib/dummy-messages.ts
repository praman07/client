import type { MessageItem } from '../model/types'

export const DUMMY_MESSAGES: Array<MessageItem> = [
  {
    id: 'm1',
    content: 'Hey everyone! Welcome to the new chat system.',
    senderId: 'u1',
    senderName: 'Alice Smith',
    timestamp: '10:30 AM',
    isMe: false,
    reactions: [{ emoji: '👋', count: 3, me: true }],
  },
  {
    id: 'm2',
    content: 'This looks amazing! Love the new sidebar.',
    senderId: 'u2',
    senderName: 'Bob Jones',
    timestamp: '10:32 AM',
    isMe: false,
  },
  {
    id: 'm3',
    content: 'Thanks! We are still working on the message input.',
    senderId: 'me',
    senderName: 'Me',
    timestamp: '10:35 AM',
    isMe: true,
  },
  {
    id: 'm4',
    content: 'Has anyone seen the design specs for the mobile view?',
    senderId: 'u1',
    senderName: 'Alice Smith',
    timestamp: '10:40 AM',
    isMe: false,
  },
]
