import { describe, expect, it } from 'vitest'
import {
  areAllEmailsValid,
  hasDuplicateEmail,
  validateAllEmails,
  validateSingleEmail,
} from './use-invite-form-validation'

describe('validateSingleEmail', () => {
  const existingEmails = ['john@example.com', 'jane@example.com']

  it('returns undefined for empty email', () => {
    expect(validateSingleEmail('', existingEmails)).toBeUndefined()
  })

  it('returns undefined for invalid email format', () => {
    expect(validateSingleEmail('notanemail', existingEmails)).toBeUndefined()
  })

  it('returns undefined for valid new email', () => {
    expect(validateSingleEmail('newuser@example.com', existingEmails)).toBeUndefined()
  })

  it('returns error message for existing member', () => {
    const result = validateSingleEmail('john@example.com', existingEmails)
    expect(result).toContain('is already a member')
  })

  it('is case-insensitive', () => {
    const result = validateSingleEmail('JOHN@example.com', existingEmails)
    expect(result).toContain('is already a member')
  })
})

describe('hasDuplicateEmail', () => {
  it('returns false for unique email', () => {
    const allEmails = ['a@test.com', 'b@test.com']
    expect(hasDuplicateEmail('c@test.com', allEmails)).toBe(false)
  })

  it('returns true for duplicate email', () => {
    const allEmails = ['a@test.com', 'b@test.com', 'a@test.com']
    expect(hasDuplicateEmail('a@test.com', allEmails)).toBe(true)
  })

  it('is case-insensitive', () => {
    const allEmails = ['User@test.com', 'user@test.com']
    expect(hasDuplicateEmail('user@test.com', allEmails)).toBe(true)
  })

  it('returns false for empty email', () => {
    expect(hasDuplicateEmail('', ['a@test.com'])).toBe(false)
  })
})

describe('areAllEmailsValid', () => {
  it('returns true when all emails are valid', () => {
    const emails = [
      { email: 'a@test.com' },
      { email: 'b@test.com' },
    ]
    expect(areAllEmailsValid(emails)).toBe(true)
  })

  it('returns false when any email is empty', () => {
    const emails = [
      { email: 'a@test.com' },
      { email: '' },
    ]
    expect(areAllEmailsValid(emails)).toBe(false)
  })

  it('returns false when any email is invalid', () => {
    const emails = [
      { email: 'a@test.com' },
      { email: 'notanemail' },
    ]
    expect(areAllEmailsValid(emails)).toBe(false)
  })
})

describe('validateAllEmails', () => {
  const existingEmails = ['member@test.com']

  it('returns empty errors for valid emails', () => {
    const emails = [{ email: 'new@test.com' }]
    const errors = validateAllEmails(emails, existingEmails)
    expect(Object.keys(errors).length).toBe(0)
  })

  it('returns error for existing member', () => {
    const emails = [{ email: 'member@test.com' }]
    const errors = validateAllEmails(emails, existingEmails)
    expect(errors[0]).toContain('is already a member')
  })

  it('returns error for duplicate within form', () => {
    const emails = [
      { email: 'test@test.com' },
      { email: 'test@test.com' },
    ]
    const errors = validateAllEmails(emails, existingEmails)
    expect(errors[0]).toBeUndefined() // First occurrence is OK
    expect(errors[1]).toBe('This email was already added')
  })

  it('skips empty emails', () => {
    const emails = [{ email: '' }]
    const errors = validateAllEmails(emails, existingEmails)
    expect(Object.keys(errors).length).toBe(0)
  })
})
