import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { STORAGE_FAVORITES_KEY } from '@/constants/storage'
import { useFavorites } from './use-favorites'
import { loadFromStorage, saveToStorage } from '@/utils/local-storage'
import type { TMDBMovie } from '@/services/tmdb'

vi.mock('@/utils/local-storage', () => ({
  loadFromStorage: vi.fn(),
  saveToStorage: vi.fn()
}))

const mockedLoadFromStorage = loadFromStorage as Mock

describe('useFavorites hook', () => {
  const sampleMovie: TMDBMovie = {
    id: 1,
    title: 'Matrix',
    genres: ['Ação'],
    poster: '/poster.jpg',
    release_year: 1999
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockedLoadFromStorage.mockReturnValue([])
  })

  it('starts with empty favorites list', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it('adds a movie to favorites', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.add(sampleMovie)
    })

    expect(result.current.favorites).toEqual([sampleMovie])
    expect(saveToStorage).toHaveBeenCalledWith(STORAGE_FAVORITES_KEY, [
      sampleMovie
    ])
  })

  it('removes a movie from favorites', () => {
    mockedLoadFromStorage.mockReturnValueOnce([sampleMovie])

    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.remove(sampleMovie.id)
    })

    expect(result.current.favorites).toEqual([])
    expect(saveToStorage).toHaveBeenCalledWith(STORAGE_FAVORITES_KEY, [])
  })

  it('toggles a movie correctly', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggle(sampleMovie)
    })
    expect(result.current.favorites).toEqual([sampleMovie])

    act(() => {
      result.current.toggle(sampleMovie)
    })
    expect(result.current.favorites).toEqual([])
  })

  it('returns true if movie is in favorites', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.add(sampleMovie)
    })

    expect(result.current.has(sampleMovie.id)).toBe(true)
  })

  it('does not add duplicate movies', async () => {
    vi.resetModules()

    vi.doMock('@/utils/local-storage', () => ({
      loadFromStorage: vi.fn(() => []),
      saveToStorage: vi.fn()
    }))

    const { useFavorites } = await import('.')
    const { saveToStorage } = await import('@/utils/local-storage')

    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.add(sampleMovie)
    })

    expect(result.current.favorites).toEqual([sampleMovie])
    expect(saveToStorage).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.add(sampleMovie)
    })

    expect(result.current.favorites).toEqual([sampleMovie])
    expect(saveToStorage).toHaveBeenCalledTimes(1)
  })
})
