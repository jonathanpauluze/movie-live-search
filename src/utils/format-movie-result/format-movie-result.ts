import type { TMDBMovieResponse, TMDBMovie, TMDBGenre } from '@/services/tmdb'

export function formatMovieResult(
  result: TMDBMovieResponse,
  genresList: TMDBGenre[]
): TMDBMovie {
  const genreNames = result.genre_ids
    .map((id) => genresList.find((g) => g.id === id)?.name)
    .filter(Boolean) as string[]

  const releaseYear = result.release_date
    ? new Date(result.release_date).getFullYear()
    : null

  return {
    id: result.id,
    title: result.title,
    genres: genreNames,
    poster: result.poster_path,
    release_year: releaseYear
  }
}
