import { useCallback, useEffect, useRef, useState } from 'react'

/** Maximum characters allowed in the member search input. */
const MAX_LENGTH = 100

/** Number of characters at which the counter turns amber (warning state). */
const WARN_AT = 85

/** Debounce delay in ms before search query takes effect. */
const DEBOUNCE_MS = 300

export interface UseSearchValidationOptions {
  /** Initial search value. Defaults to empty string. */
  initialValue?: string
  /** Callback fired after debounce when search value stabilizes. */
  onDebouncedSearch: (value: string) => void
}

export interface UseSearchValidationReturn {
  /** Current raw input value (may exceed max). Reflects keystroke immediately. */
  inputValue: string
  /** Processed value passed to parent (always respects maxLength). */
  processedValue: string
  /** Whether the input has reached the character limit. */
  isAtLimit: boolean
  /** Whether the input is in the warning zone (>= warnAt chars). */
  isNearLimit: boolean
  /** Characters remaining until limit. */
  remainingChars: number
  /** Current character count. */
  currentLength: number
  /** Change handler to pass to <input onChange>. */
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Maximum length for the input element. */
  maxLength: number
  /** Warning threshold for UI styling. */
  warnAt: number
}

/**
 * useSearchValidation
 *
 * Handles search input validation, character counting, and debounced updates.
 * - inputValue: tracks raw keystroke state (always up-to-date)
 * - processedValue: sanitized + clamped value synced to parent
 * - Debounce: onDebouncedSearch fires 300ms after last keystroke
 *
 * Separation: this hook owns validation logic so it stays unit-testable.
 * The component owns rendering — it just consumes the values this hook produces.
 */
export function useSearchValidation({
  initialValue = '',
  onDebouncedSearch,
}: UseSearchValidationOptions): UseSearchValidationReturn {
  // Raw input — reflects every keystroke immediately
  const [inputValue, setInputValue] = useState(initialValue)

  // Processed value — clamped to maxLength, synced to parent
  const [processedValue, setProcessedValue] = useState(() =>
    initialValue.slice(0, MAX_LENGTH),
  )

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentLength = inputValue.length
  const isAtLimit = currentLength >= MAX_LENGTH
  const isNearLimit = currentLength >= WARN_AT
  const remainingChars = Math.max(0, MAX_LENGTH - currentLength)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value

      // 1. Hard cap at maxLength — handles edge cases (e.g. paste from clipboard)
      const clamped = raw.slice(0, MAX_LENGTH)

      // 2. Update raw state immediately so the input feels snappy
      setInputValue(raw)
      setProcessedValue(clamped)

      // 3. Debounce the actual search query
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        onDebouncedSearch(clamped.trim())
      }, DEBOUNCE_MS)
    },
    [onDebouncedSearch],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return {
    inputValue,
    processedValue,
    isAtLimit,
    isNearLimit,
    remainingChars,
    currentLength,
    handleChange,
    maxLength: MAX_LENGTH,
    warnAt: WARN_AT,
  }
}

