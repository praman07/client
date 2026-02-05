/**
 * Extract initials from a full name
 * @param fullName - The user's full name
 * @returns Two-letter initials in uppercase
 *
 * @example
 * getInitials('John Doe') // 'JD'
 * getInitials('Alice') // 'AL'
 * getInitials('') // '?'
 */
export function getInitials(fullName: string): string {
  if (!fullName || fullName.trim().length === 0) {
    return '?'
  }

  const words = fullName.trim().split(/\s+/)

  if (words.length >= 2) {
    // Take first letter of first two words
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  // Single word: take first two characters
  const name = words[0]
  if (name.length >= 2) {
    return name.substring(0, 2).toUpperCase()
  }

  return name.toUpperCase()
}
