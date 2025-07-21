import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSearchMovies } from '.'
import {
  TMDBClient,
  type TMDBGenre,
  type TMDBMovieResponse
} from '@/services/tmdb'

vi.mock('@/hooks/use-debounced-value', () => ({
  useDebouncedValue: (value: string) => value
}))

vi.mock('@/hooks/use-genres', () => ({
  useGenres: () =>
    [
      { id: 1, name: 'Ação' },
      { id: 2, name: 'Comédia' }
    ] satisfies TMDBGenre[]
}))

vi.mock('@/utils/format-movie-result', () => ({
  formatMovieResult: vi.fn((result: TMDBMovieResponse) => ({
    id: result.id,
    title: result.title,
    genres: ['Mocked'],
    poster: result.poster_path,
    release_year: 2023
  }))
}))

vi.mock('@/services/tmdb', () => ({
  TMDBClient: {
    searchMovie: vi.fn()
  }
}))

const mockedSearchMovie = vi.mocked(TMDBClient.searchMovie)

describe('useSearchMovies hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('performs search and formats results', async () => {
    const fakeResults: TMDBMovieResponse[] = [
      {
        id: 1,
        title: 'Matrix',
        genre_ids: [1],
        poster_path: '/poster.jpg',
        release_date: '1999-03-31',
        adult: false,
        backdrop_path: '',
        original_language: 'en',
        original_title: 'Matrix',
        overview: '',
        popularity: 1,
        video: false,
        vote_average: 5,
        vote_count: 1000
      }
    ]

    mockedSearchMovie.mockResolvedValueOnce({
      results: fakeResults,
      total_pages: 1,
      total_results: 1,
      page: 1
    })

    const { result } = renderHook(() => useSearchMovies('Matrix'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.results).toHaveLength(1)
    expect(result.current.results[0].title).toBe('Matrix')
    expect(result.current.results[0].genres).toEqual(['Mocked'])
  })

  it('fetchNextPage appends new results and updates state', async () => {
    const firstPage: TMDBMovieResponse[] = [
      {
        id: 1,
        title: 'Matrix',
        genre_ids: [1],
        poster_path: '/matrix.jpg',
        release_date: '1999-03-31',
        adult: false,
        backdrop_path: '',
        original_language: 'en',
        original_title: 'Matrix',
        overview: '',
        popularity: 1,
        video: false,
        vote_average: 5,
        vote_count: 1000
      }
    ]

    const secondPage: TMDBMovieResponse[] = [
      {
        id: 2,
        title: 'Matrix Reloaded',
        genre_ids: [1],
        poster_path: '/reloaded.jpg',
        release_date: '2003-05-15',
        adult: false,
        backdrop_path: '',
        original_language: 'en',
        original_title: 'Matrix Reloaded',
        overview: '',
        popularity: 1,
        video: false,
        vote_average: 5,
        vote_count: 1000
      }
    ]

    mockedSearchMovie
      .mockResolvedValueOnce({
        results: firstPage,
        total_pages: 2,
        total_results: 2,
        page: 1
      })
      .mockResolvedValueOnce({
        results: secondPage,
        total_pages: 2,
        total_results: 2,
        page: 2
      })

    const { result } = renderHook(() => useSearchMovies('Matrix'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.fetchNextPage()
    })

    expect(result.current.results).toHaveLength(2)
    expect(result.current.results[1].title).toBe('Matrix Reloaded')
  })

  it('does nothing if hasMore is false', async () => {
    mockedSearchMovie.mockResolvedValueOnce({
      results: [],
      total_pages: 1,
      total_results: 0,
      page: 1
    })

    const { result } = renderHook(() => useSearchMovies('Matrix'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.fetchNextPage()
    })

    expect(mockedSearchMovie).toHaveBeenCalledTimes(1)
  })
})
