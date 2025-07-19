import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGenres } from '.'
import { STORAGE_GENRES_KEY } from '@/constants/storage'
import { loadFromStorage, saveToStorage } from '@/utils/local-storage'
import { TMDBClient, type TMDBGenre } from '@/services/tmdb'

vi.mock('@/services/tmdb', () => ({
  TMDBClient: {
    getGenres: vi.fn()
  }
}))

vi.mock('@/utils/local-storage', () => ({
  loadFromStorage: vi.fn(),
  saveToStorage: vi.fn()
}))

const mockedLoadFromStorage = loadFromStorage as Mock
const mockedGetGenres = TMDBClient.getGenres as Mock

describe('useGenres hook', () => {
  const mockGenres: TMDBGenre[] = [
    { id: 1, name: 'Ação' },
    { id: 2, name: 'Comédia' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns genres from localStorage if available', () => {
    mockedLoadFromStorage.mockReturnValue(mockGenres)

    const { result } = renderHook(() => useGenres())

    expect(result.current).toEqual(mockGenres)
    expect(loadFromStorage).toHaveBeenCalledWith(STORAGE_GENRES_KEY)
    expect(TMDBClient.getGenres).not.toHaveBeenCalled()
  })

  it('fetches genres from API if not in localStorage', async () => {
    mockedLoadFromStorage.mockReturnValue(null)
    mockedGetGenres.mockResolvedValue(mockGenres)

    const { result } = renderHook(() => useGenres())

    await waitFor(() => {
      expect(result.current).toEqual(mockGenres)
    })

    expect(TMDBClient.getGenres).toHaveBeenCalled()
    expect(saveToStorage).toHaveBeenCalledWith(STORAGE_GENRES_KEY, mockGenres)
  })
})
