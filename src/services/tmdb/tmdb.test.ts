import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  TMDBClient,
  type TMDBGenresResponse,
  type TMDBSearchResponse,
  type TMDBExternalIdsResponse
} from '.'
import { api } from '@/lib/api'

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn()
  }
}))

const mockedApi = api as unknown as {
  get: ReturnType<typeof vi.fn>
}

describe('TMDBClient', () => {
  beforeEach(() => {
    mockedApi.get.mockReset()
  })

  it('calls searchMovie with correct query params', async () => {
    const mockResponse: TMDBSearchResponse = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0
    }

    mockedApi.get.mockResolvedValueOnce(mockResponse)

    const result = await TMDBClient.searchMovie('batman')

    expect(mockedApi.get).toHaveBeenCalledWith(
      expect.stringContaining('/search/movie')
    )

    expect(result).toEqual(mockResponse)
  })

  it('returns genre list from getGenres', async () => {
    const mockResponse: TMDBGenresResponse = {
      genres: [{ id: 1, name: 'Ação' }]
    }

    mockedApi.get.mockResolvedValueOnce(mockResponse)

    const genres = await TMDBClient.getGenres()
    expect(genres).toEqual(mockResponse.genres)
  })

  it('returns external ids from getExternalIds', async () => {
    const mockResponse: TMDBExternalIdsResponse = {
      id: 123,
      imdb_id: 'tt123',
      wikidata_id: null,
      facebook_id: null,
      instagram_id: null,
      twitter_id: null
    }

    mockedApi.get.mockResolvedValueOnce(mockResponse)

    const ids = await TMDBClient.getExternalIds(123)
    expect(ids).toEqual(mockResponse)
    expect(mockedApi.get).toHaveBeenCalledWith('/movie/123/external_ids')
  })
})
