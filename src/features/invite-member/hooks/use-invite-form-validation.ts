import { useMemo } from 'react'

/** Minimal shape required by this hook — only user.email is accessed. */
interface MemberWithEmail {
  user: { email: string }
}

/**
 * Check if email belongs to existing workspace member
 * Returns error message if already member, undefined otherwise
 */
export function validateSingleEmail(
  email: string,
  existingMemberEmails: Array<string>
): string | undefined {
  if (!email || !email.includes('@')) {
    return undefined // Let Zod handle invalid format/empty
  }
  const normalizedEmail = email.toLowerCase().trim()
  if (existingMemberEmails.includes(normalizedEmail)) {
    return `${email} is already a member`
  }
  return undefined
}

/**
 * Check if email is duplicate within the form
 * Returns true if duplicate found
 */
export function hasDuplicateEmail(
  email: string,
  allEmails: Array<string>
): boolean {
  if (!email) return false
  const normalized = email.toLowerCase().trim()
  const count = allEmails.filter((e) => e.toLowerCase().trim() === normalized).length
  return count > 1
}

/**
 * Check if all fields have valid emails (for Add button)
 */
export function areAllEmailsValid(
  emails: Array<{ email: string }>
): boolean {
  return emails.every((field) => {
    const e = field.email.trim()
    return e.length > 0 && e.includes('@')
  })
}

/**
 * Validate all emails for submit
 * Returns map of field index to error message
 */
export function validateAllEmails(
  emails: Array<{ email: string }>,
  existingMemberEmails: Array<string>
): Record<number, string> {
  const errors: Record<number, string> = {}
  const seen = new Map<string, number>() // email -> first index

  emails.forEach((field, index) => {
    const email = field.email.trim()

    // Skip empty emails (Zod handles required)
    if (!email) return

    // Check for duplicates within form
    const normalized = email.toLowerCase()
    if (seen.has(normalized)) {
      errors[index] = 'This email was already added'
      return
    }
    seen.set(normalized, index)

    // Check if already member
    const memberError = validateSingleEmail(email, existingMemberEmails)
    if (memberError) {
      errors[index] = memberError
    }
  })

  return errors
}

interface UseInviteFormValidationProps {
  members?: Array<MemberWithEmail>
}

export function useInviteFormValidation({ members }: UseInviteFormValidationProps) {
  const existingMemberEmails = useMemo(() => {
    return (members ?? []).map((m) => m.user.email.toLowerCase())
  }, [members])

  const validateSingle = (email: string) => {
    return validateSingleEmail(email, existingMemberEmails)
  }

  const validateDuplicate = (email: string, allEmails: Array<string>) => {
    return hasDuplicateEmail(email, allEmails)
  }

  const validateAll = (emails: Array<{ email: string }>) => {
    return validateAllEmails(emails, existingMemberEmails)
  }

  const canAddMore = (emails: Array<{ email: string }>) => {
    return areAllEmailsValid(emails)
  }

  return {
    validateSingle,
    validateDuplicate,
    validateAll,
    canAddMore,
    existingMemberEmails,
  }
}
