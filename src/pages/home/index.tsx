import { useState, useRef, useCallback, useEffect } from 'react'
import { MovieSearchBar } from '@/components/movie-search-bar'
import { MoviesFavoritesTable } from '@/components/movies-favorites-table '
import { MoviesResultTable } from '@/components/movies-result-table'
import { RedirectModal } from '@/components/redirect-modal'
import { TMDBClient } from '@/services/tmdb/client'
import { useSearchMovies } from '@/hooks/use-search-movies'
import { useFavorites } from '@/hooks/use-favorites'
import type { TMDBMovie } from '@/services/tmdb/types'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const loaderRef = useRef<HTMLTableRowElement | null>(null)

  const { favorites, remove } = useFavorites()

  const { isLoading, suggestions, results, fetchNextPage, clearSuggestions } =
    useSearchMovies(searchTerm)

  const handleChange = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleSelect = useCallback(
    async (movie: TMDBMovie) => {
      setSearchTerm(movie.title)
      setIsRedirecting(true)
      clearSuggestions()

      const fallbackUrl = `https://www.imdb.com/find?q=${encodeURIComponent(
        movie.title
      )}`

      try {
        const { imdb_id } = await TMDBClient.getExternalIds(movie.id)

        const imdbUrl = imdb_id
          ? `https://www.imdb.com/title/${imdb_id}`
          : fallbackUrl

        window.open(imdbUrl, '_blank')
      } catch (err) {
        console.error(err)

        window.open(fallbackUrl, '_blank')
      } finally {
        setIsRedirecting(false)
      }
    },
    [clearSuggestions]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    const el = loaderRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [fetchNextPage])

  return (
    <main>
      <MovieSearchBar
        isLoading={isLoading}
        value={searchTerm}
        suggestions={suggestions}
        onChange={handleChange}
        onSelect={handleSelect}
      />

      {searchTerm ? (
        <section style={{ paddingTop: '26rem' }}>
          <MoviesResultTable movies={results} ref={loaderRef} />
        </section>
      ) : (
        <section>
          <h2>Meus Favoritos</h2>
          {favorites.length === 0 ? (
            <p>Nenhum filme favoritado ainda.</p>
          ) : (
            <MoviesFavoritesTable movies={favorites} onRemove={remove} />
          )}
        </section>
      )}

      <RedirectModal isOpen={isRedirecting} />
    </main>
  )
}
