export interface MessageAttachment {
  id: string
  type: 'image' | 'file'
  url: string
  name: string
}

export interface MessageReaction {
  emoji: string
  count: number
  me: boolean
}

export interface MessageItem {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  timestamp: string
  attachments?: Array<MessageAttachment>
  reactions?: Array<MessageReaction>
  isMe?: boolean
}
