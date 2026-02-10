const THROTTLE_MS = 16.6 // 60fps

let lastSentAt = 0
let rafId: number | null = null

export function sendCursorUpdate(
  x: number,
  y: number,
  pointer: string,
  sender: (x: number, y: number, pointer: string) => void,
) {
  const now = performance.now()

  if (now - lastSentAt < THROTTLE_MS) {
    return
  }

  sender(x, y, pointer)
  lastSentAt = now
}

export function handlePointerMove(
  event: PointerEvent,
  sender: (x: number, y: number, pointer: string) => void,
) {
  const { clientX, clientY, pointerType } = event

  if (rafId) {
    cancelAnimationFrame(rafId)
  }

  rafId = requestAnimationFrame(() => {
    sendCursorUpdate(clientX, clientY, pointerType, sender)
    rafId = null
  })
}
