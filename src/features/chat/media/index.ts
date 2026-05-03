/**
 * features/chat/media — Public API
 * @layer Features → chat/media
 */

// API
export { uploadChatMedia, extractFileFromClipboard, ChatMediaUploadError } from './api/upload-chat-media'

// UI
export { ChatAttachmentPicker } from './ui/ChatAttachmentPicker'
export { ChatAttachmentPreview } from './ui/ChatAttachmentPreview'
export { ChatAttachmentRenderer } from './ui/ChatAttachmentRenderer'
export type { StagedAttachment } from './ui/ChatAttachmentPreview'

// Hooks
export { useDownloadUrl, downloadUrlKeys } from './hooks/use-download-url'
export type { DownloadUrlStatus, UseDownloadUrlResult } from './hooks/use-download-url'
export { useVaultQuota, invalidateVaultQuota } from './hooks/use-vault-quota'
export { useMediaCache } from './hooks/use-media-cache'
