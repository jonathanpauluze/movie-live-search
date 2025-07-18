import { describe, it, expect, vi, beforeEach } from 'vitest'
import { openIMDBPage } from './open-imdb-page'
import { TMDBClient } from '@/services/tmdb'
import type { TMDBMovie } from '@/services/tmdb'

vi.mock('@/services/tmdb', () => ({
  TMDBClient: {
    getExternalIds: vi.fn()
  }
}))

const mockedGetExternalIds = TMDBClient.getExternalIds as unknown as ReturnType<
  typeof vi.fn
>

describe('openIMDBPage', () => {
  const mockWindowOpen = vi.fn()

  const movie: TMDBMovie = {
    id: 123,
    title: 'Clube da Luta',
    genres: ['Ação'],
    poster: '/poster.jpg',
    release_year: 1999
  }

  beforeEach(() => {
    mockedGetExternalIds.mockReset()
    mockWindowOpen.mockReset()
    vi.stubGlobal('window', {
      open: mockWindowOpen
    })
  })

  it('opens the correct IMDB url when imdb_id is available', async () => {
    mockedGetExternalIds.mockResolvedValueOnce({ imdb_id: 'tt0137523' })

    await openIMDBPage(movie)

    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://www.imdb.com/title/tt0137523',
      '_blank'
    )
  })

  it('falls back to search URL when imdb_id is missing', async () => {
    mockedGetExternalIds.mockResolvedValueOnce({ imdb_id: null })

    await openIMDBPage(movie)

    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://www.imdb.com/find?q=Clube%20da%20Luta',
      '_blank'
    )
  })

  it('falls back to search URL when getExternalIds throws', async () => {
    mockedGetExternalIds.mockRejectedValueOnce(new Error('API error'))

    await openIMDBPage(movie)

    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://www.imdb.com/find?q=Clube%20da%20Luta',
      '_blank'
    )
  })
})
