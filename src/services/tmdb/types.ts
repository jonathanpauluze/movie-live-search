export type TMDBMovie = {
  id: number
  title: string
  poster: string | null
  release_year: number | null
  genres: string[]
}

export type TMDBGenre = {
  id: number
  name: string
}

export type TMDBMovieResponse = {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export type TMDBSearchResponse = {
  page: number
  results: TMDBMovieResponse[]
  total_pages: number
  total_results: number
}

export type TMDBGenresResponse = {
  genres: TMDBGenre[]
}

export type TMDBExternalIdsResponse = {
  id: number
  imdb_id: string | null
  wikidata_id: string | null
  facebook_id: string | null
  instagram_id: string | null
  twitter_id: string | null
}
