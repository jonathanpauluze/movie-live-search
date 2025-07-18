import { TMDBClient } from '@/services/tmdb/client'
import type { TMDBMovie } from '@/services/tmdb/types'

export async function openIMDBPage(movie: TMDBMovie) {
  const fallbackUrl = `https://www.imdb.com/find?q=${encodeURIComponent(
    movie.title
  )}`

  try {
    const { imdb_id } = await TMDBClient.getExternalIds(movie.id)
    const imdbUrl = imdb_id
      ? `https://www.imdb.com/title/${imdb_id}`
      : fallbackUrl
    window.open(imdbUrl, '_blank')
  } catch (error) {
    console.error(error)
    window.open(fallbackUrl, '_blank')
  }
}
