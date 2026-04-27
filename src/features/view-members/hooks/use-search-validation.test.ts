import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useSearchValidation } from './use-search-validation'

// Mock timers for debounce testing
beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers() })

describe('useSearchValidation', () => {
  it('clamps input to maxLength', () => {
    const onSearch = vi.fn()
    const { result } = renderHook(() =>
      useSearchValidation({ onDebouncedSearch: onSearch })
    )

    const longString = 'a'.repeat(150)
    act(() => {
      result.current.handleChange({ target: { value: longString } } as any)
    })

    expect(result.current.processedValue.length).toBeLessThanOrEqual(100)
    expect(result.current.currentLength).toBe(150) // raw reflects actual length
    expect(result.current.remainingChars).toBe(0)
  })

  it('debounces the onDebouncedSearch call by 300ms', () => {
    const onSearch = vi.fn()
    const { result } = renderHook(() =>
      useSearchValidation({ onDebouncedSearch: onSearch })
    )

    act(() => {
      result.current.handleChange({ target: { value: 'abc' } } as any)
    })

    expect(onSearch).not.toHaveBeenCalled()

    act(() => { vi.advanceTimersByTime(300) })
    expect(onSearch).toHaveBeenCalledWith('abc')
  })

  it('isNearLimit is true when input >= warnAt (85)', () => {
    const onSearch = vi.fn()
    const { result } = renderHook(() =>
      useSearchValidation({ onDebouncedSearch: onSearch })
    )

    act(() => {
      result.current.handleChange({ target: { value: 'a'.repeat(86) } } as any)
    })

    expect(result.current.isNearLimit).toBe(true)
    expect(result.current.isAtLimit).toBe(false)
  })

  it('isAtLimit is true when input >= maxLength (100)', () => {
    const onSearch = vi.fn()
    const { result } = renderHook(() =>
      useSearchValidation({ onDebouncedSearch: onSearch })
    )

    act(() => {
      result.current.handleChange({ target: { value: 'a'.repeat(100) } } as any)
    })

    expect(result.current.isAtLimit).toBe(true)
  })

  it('trims value before passing to onDebouncedSearch', () => {
    const onSearch = vi.fn()
    const { result } = renderHook(() =>
      useSearchValidation({ onDebouncedSearch: onSearch })
    )

    act(() => {
      result.current.handleChange({ target: { value: '  foo  ' } } as any)
    })

    act(() => { vi.advanceTimersByTime(300) })
    expect(onSearch).toHaveBeenCalledWith('foo')
  })
})