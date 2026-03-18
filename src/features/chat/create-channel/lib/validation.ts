// Channel name validation constants
export const CHANNEL_NAME_MIN_LENGTH = 2
export const CHANNEL_NAME_MAX_LENGTH = 25
export const CHANNEL_NAME_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/

// Topic validation constants
export const TOPIC_MAX_LENGTH = 250

// Reserved channel names
export const RESERVED_CHANNEL_NAMES = [
  'general',
  'random',
  'help',
  'admin',
  'system',
  'bot',
  'api',
  'webhook',
  'integration',
]

export interface ValidationResult {
  valid: boolean
  message?: string
  sanitized?: string
}

/**
 * Basic HTML sanitization - removes common XSS vectors
 */
function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function validateChannelName(name: string): ValidationResult {
  const trimmed = name.trim().toLowerCase()

  // Check length
  if (trimmed.length < CHANNEL_NAME_MIN_LENGTH) {
    return {
      valid: false,
      message: `Channel name must be at least ${CHANNEL_NAME_MIN_LENGTH} characters`,
    }
  }

  if (trimmed.length > CHANNEL_NAME_MAX_LENGTH) {
    return {
      valid: false,
      message: `Channel name must be less than ${CHANNEL_NAME_MAX_LENGTH} characters`,
    }
  }

  // Check format
  if (!CHANNEL_NAME_REGEX.test(trimmed)) {
    return {
      valid: false,
      message:
        'Channel name must contain only lowercase letters, numbers, and hyphens',
    }
  }

  // Check reserved names
  if (RESERVED_CHANNEL_NAMES.includes(trimmed)) {
    return {
      valid: false,
      message: `"${trimmed}" is a reserved channel name`,
    }
  }

  return {
    valid: true,
    sanitized: trimmed,
  }
}

export function validateChannelTopic(topic: string): ValidationResult {
  const trimmed = topic.trim()

  if (trimmed.length > TOPIC_MAX_LENGTH) {
    return {
      valid: false,
      message: `Topic must be less than ${TOPIC_MAX_LENGTH} characters`,
    }
  }

  // Sanitize HTML and potentially harmful content
  const sanitized = sanitizeHtml(trimmed)

  return {
    valid: true,
    sanitized,
  }
}

export function sanitizeInput(input: string): string {
  return sanitizeHtml(input.trim())
}
