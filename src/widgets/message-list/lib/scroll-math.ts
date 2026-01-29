/**
 * Calculates the scroll position adjustment needed to maintain visual stability
 * when new items are prepended to the list (Inverse Scrolling).
 */
export function calculateInverseScrollDelta(
  prevScrollHeight: number,
  newScrollHeight: number,
): number {
  return newScrollHeight - prevScrollHeight
}

/**
 * Checks if the user is close enough to the bottom to trigger "Stick to Bottom".
 */
export function isNearBottom(
  scrollTop: number,
  clientHeight: number,
  scrollHeight: number,
  threshold: number,
): boolean {
  const distanceToBottom = scrollHeight - (scrollTop + clientHeight)
  return distanceToBottom <= threshold
}

/**
 * Checks if the user is close enough to the top to trigger "Fetch History".
 */
export function isNearTop(scrollTop: number, threshold: number): boolean {
  return scrollTop <= threshold
}
