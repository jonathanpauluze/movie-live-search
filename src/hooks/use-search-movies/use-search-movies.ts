import { useState, useRef, useEffect } from 'react'
import { TMDBClient } from '@/services/tmdb'
import { formatMovieResult } from '@/utils/format-movie-result'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useGenres } from '@/hooks/use-genres'
import type { TMDBMovie } from '@/services/tmdb'

export function useSearchMovies(term: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
  const [results, setResults] = useState<TMDBMovie[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const debouncedTerm = useDebouncedValue(term, 300)
  const genres = useGenres()
  const prevTermRef = useRef('')

  async function fetchNextPage() {
    if (!debouncedTerm || isFetchingNextPage || !hasMore) return

    setIsFetchingNextPage(true)

    try {
      const response = await TMDBClient.searchMovie(debouncedTerm, page)
      const { results, total_pages } = response

      const formatted = results.map((result) =>
        formatMovieResult(result, genres)
      )

      setResults((prev) => [...prev, ...formatted])
      setPage((prev) => prev + 1)
      setHasMore(page + 1 <= total_pages)
    } catch {
      setHasMore(false)
    } finally {
      setIsFetchingNextPage(false)
    }
  }

  useEffect(() => {
    if (term) {
      setIsLoading(true)
    }
  }, [term])

  useEffect(() => {
    if (!debouncedTerm) {
      setResults([])
      setPage(1)
      setHasMore(false)
      return
    }

    if (debouncedTerm !== prevTermRef.current) {
      prevTermRef.current = debouncedTerm
      setIsLoading(true)
      setPage(1)
      TMDBClient.searchMovie(debouncedTerm, 1)
        .then(({ results, total_pages }) => {
          const formatted = results.map((result) =>
            formatMovieResult(result, genres)
          )
          setResults(formatted)
          setHasMore(2 <= total_pages)
          setPage(2)
        })
        .catch(() => {
          setResults([])
          setHasMore(false)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [debouncedTerm, genres])

  return { isLoading, results, fetchNextPage, isFetchingNextPage }
}
