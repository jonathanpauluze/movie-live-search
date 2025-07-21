import { describe, it, expect } from 'vitest'
import { formatMovieResult } from './format-movie-result'
import type { TMDBMovieResponse, TMDBGenre } from '@/services/tmdb'

describe('format-movie-result utils', () => {
  const genresList: TMDBGenre[] = [
    { id: 1, name: 'Ação' },
    { id: 2, name: 'Comédia' },
    { id: 3, name: 'Drama' }
  ]

  function createMovieResponse(
    overrides: Partial<TMDBMovieResponse>
  ): TMDBMovieResponse {
    return {
      id: 0,
      title: '',
      genre_ids: [],
      poster_path: '',
      release_date: '',
      adult: false,
      backdrop_path: '',
      original_language: 'en',
      original_title: '',
      overview: '',
      popularity: 0,
      video: false,
      vote_average: 0,
      vote_count: 0,
      ...overrides
    }
  }

  it('formats a movie with known genre IDs and release date', () => {
    const result = createMovieResponse({
      id: 101,
      title: 'Teste: O Filme',
      genre_ids: [1, 3],
      poster_path: '/poster.jpg',
      release_date: '2021-08-15'
    })

    const formatted = formatMovieResult(result, genresList)

    expect(formatted).toEqual({
      id: 101,
      title: 'Teste: O Filme',
      genres: ['Ação', 'Drama'],
      poster: '/poster.jpg',
      release_year: 2021
    })
  })

  it('ignores unknown genre IDs', () => {
    const result = createMovieResponse({
      id: 102,
      title: 'Filme com gênero desconhecido',
      genre_ids: [99],
      poster_path: '/poster.jpg',
      release_date: '2020-01-01'
    })

    const formatted = formatMovieResult(result, genresList)

    expect(formatted.genres).toEqual([])
  })

  it('returns null for missing release date', () => {
    const result = createMovieResponse({
      id: 103,
      title: 'Filme sem data',
      genre_ids: [1],
      poster_path: '/poster.jpg',
      release_date: ''
    })

    const formatted = formatMovieResult(result, genresList)

    expect(formatted.release_year).toBeNull()
  })

  it('returns empty genres if genre_ids is empty', () => {
    const result = createMovieResponse({
      id: 104,
      title: 'Filme sem gênero',
      genre_ids: [],
      poster_path: '/poster.jpg',
      release_date: '2022-01-01'
    })

    const formatted = formatMovieResult(result, genresList)

    expect(formatted.genres).toEqual([])
  })
})
