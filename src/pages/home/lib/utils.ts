export function extractFirstName(fullName?: string | null): string {
  if (!fullName) return 'there'
  return fullName.split(' ')[0]
}
