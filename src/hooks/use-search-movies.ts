import { useState, useEffect } from 'react'
import { TMDBClient } from '@/services/tmdb/client'
import { formatMovieResult } from '@/utils/format-movie-result'
import { useDebouncedValue } from './use-debounced-value'
import { useGenres } from './use-genres'
import type { TMDBMovie } from '@/services/tmdb/types'

export function useSearchMovies(term: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [suggestions, setSuggestions] = useState<TMDBMovie[]>([])
  const [results, setResults] = useState<TMDBMovie[]>([])

  const debouncedTerm = useDebouncedValue(term, 300)
  const genres = useGenres()

  function clearSuggestions() {
    setSuggestions([])
  }

  useEffect(() => {
    if (term) {
      setIsLoading(true)
    }
  }, [term])

  useEffect(() => {
    if (!debouncedTerm) {
      setSuggestions([])
      setResults([])
      return
    }

    TMDBClient.searchMovie(debouncedTerm)
      .then(({ results }) => {
        const movies = results.map((r) => formatMovieResult(r, genres))
        setSuggestions(movies)
        setResults(movies)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [debouncedTerm, genres])

  return { isLoading, suggestions, results, clearSuggestions }
}
