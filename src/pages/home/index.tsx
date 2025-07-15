import { useEffect, useState } from 'react'
import { MovieSearchBar } from '@/components/movie-search-bar'
import { TMDBClient } from '@/services/tmdb/client'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useGenres } from '@/hooks/use-genres'
import type { TMDBMovie } from '@/services/tmdb/types'
import { formatMovieResult } from '@/utils/format-movie-result'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<TMDBMovie[]>([])
  const [results, setResults] = useState<TMDBMovie[]>([])

  const genres = useGenres()
  const debouncedTerm = useDebouncedValue(searchTerm, 300)

  useEffect(() => {
    if (!debouncedTerm) {
      setSuggestions([])
      return
    }

    TMDBClient.searchMovie(debouncedTerm)
      .then((response) => {
        const results = response.results.map((result) =>
          formatMovieResult(result, genres)
        )
        setSuggestions(results)
        setResults(results)
      })
      .catch(console.error)
  }, [debouncedTerm, genres])

  function handleSelect(movie: TMDBMovie) {
    setSearchTerm(movie.title)
    setSuggestions([])
  }

  return (
    <main style={{ padding: '2rem' }}>
      <MovieSearchBar
        value={searchTerm}
        suggestions={suggestions}
        onChange={setSearchTerm}
        onSelect={handleSelect}
      />

      <section style={{ marginTop: '2rem' }}>
        {results.map((movie) => (
          <div key={movie.id} style={{ marginBottom: '1rem' }}>
            <strong>{movie.title}</strong> ({movie.release_year})
          </div>
        ))}
      </section>
    </main>
  )
}
