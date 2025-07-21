import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '.'
import { STORAGE_THEME_KEY } from '@/constants/storage'
import { loadFromStorage, saveToStorage } from '@/utils/local-storage'

vi.mock('@/utils/local-storage', () => ({
  loadFromStorage: vi.fn(),
  saveToStorage: vi.fn()
}))

const loadFromStorageMock = vi.mocked(loadFromStorage)

describe('useTheme hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    document.documentElement.classList.remove('light', 'dark')
  })

  it('initializes with value from storage if available', () => {
    loadFromStorageMock.mockReturnValue('dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(saveToStorage).toHaveBeenCalledWith(STORAGE_THEME_KEY, 'dark')
  })

  it('falls back to prefers-color-scheme if storage is empty', () => {
    loadFromStorageMock.mockReturnValue(null)

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      })
    )

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(saveToStorage).toHaveBeenCalledWith(STORAGE_THEME_KEY, 'dark')
  })

  it('toggles theme between light and dark', () => {
    loadFromStorageMock.mockReturnValue('light')

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(saveToStorage).toHaveBeenCalledWith(STORAGE_THEME_KEY, 'dark')

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(saveToStorage).toHaveBeenCalledWith(STORAGE_THEME_KEY, 'light')
  })
})
