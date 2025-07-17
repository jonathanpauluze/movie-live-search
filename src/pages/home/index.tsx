import { useState, useCallback } from 'react'
import { MovieSearchBar } from '@/components/movie-search-bar'
import { MoviesFavoritesTable } from '@/components/movies-favorites-table '
import { MoviesResultTable } from '@/components/movies-result-table'
import { RedirectModal } from '@/components/redirect-modal'
import { Spinner } from '@/components/spinner'
import { TMDBClient } from '@/services/tmdb/client'
import { useSearchMovies } from '@/hooks/use-search-movies'
import { useFavorites } from '@/hooks/use-favorites'
import styles from './home.module.css'
import type { TMDBMovie } from '@/services/tmdb/types'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { favorites, remove } = useFavorites()

  const { isLoading, isFetchingNextPage, results, fetchNextPage } =
    useSearchMovies(searchTerm)

  const loaderRef = useIntersectionObserver<HTMLTableRowElement>(
    fetchNextPage,
    { threshold: 0.4 }
  )

  const handleChange = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleSelect = useCallback(async (movie: TMDBMovie) => {
    setSearchTerm(movie.title)
    setIsRedirecting(true)

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
  }, [])

  return (
    <main>
      <MovieSearchBar
        isLoading={isLoading}
        value={searchTerm}
        suggestions={results}
        onChange={handleChange}
        onSelect={handleSelect}
        onLastItemVisible={fetchNextPage}
      />

      {searchTerm ? (
        <section className={styles.resultSection}>
          <MoviesResultTable movies={results} ref={loaderRef} />

          {isFetchingNextPage ? (
            <div className={styles.loadingWrapper}>
              <Spinner />
              <p>Carregando mais resultados...</p>
            </div>
          ) : null}
        </section>
      ) : (
        <section className={styles.favoritesSection}>
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
