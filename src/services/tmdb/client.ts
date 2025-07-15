import { api } from '@/lib/api'
import type { TMDBSearchResponse, TMDBGenresResponse, TMDBGenre } from './types'

export class TMDBClient {
  static async searchMovie(query: string, page = '1') {
    const formatted = new URLSearchParams({
      query,
      include_adult: 'false',
      language: 'pt-BR',
      page
    }).toString()

    const response = await api.get<TMDBSearchResponse>(
      `/search/movie?${formatted}`
    )

    return response
  }

  static async getGenres(): Promise<TMDBGenre[]> {
    const response = await api.get<TMDBGenresResponse>(
      '/genre/movie/list?language=pt-BR'
    )

    return response.genres
  }
}
