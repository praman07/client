/**
 * Compares two BlockNote editor document states.
 * Returns true only if the description content has actually changed.
 * Prevents spurious S3 uploads when the user opens and closes the editor
 * without making any edits.
 *
 * @pure — no side effects, safe to unit test in isolation
 * @layer Features
 */
export function hasDescriptionChanged(
  current: unknown[],
  original: unknown[],
): boolean {
  return JSON.stringify(current) !== JSON.stringify(original)
}
