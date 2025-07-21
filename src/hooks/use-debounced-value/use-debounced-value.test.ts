import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebouncedValue } from './use-debounced-value'

describe('useDebouncedValue hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('Olá', 500))
    expect(result.current).toBe('Olá')
  })

  it('does not update the value before the delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 500),
      { initialProps: { value: 'Olá' } }
    )

    rerender({ value: 'Planne' })

    expect(result.current).toBe('Olá')

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(result.current).toBe('Olá')
  })

  it('updates the value after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 500),
      { initialProps: { value: 'Olá' } }
    )

    rerender({ value: 'Planne' })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('Planne')
  })

  it('resets timer if value changes before delay completes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 500),
      { initialProps: { value: 'valor 1' } }
    )

    rerender({ value: 'valor 2' })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    rerender({ value: 'valor 3' })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('valor 1')

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('valor 3')
  })
})
