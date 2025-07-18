import { useState } from 'react'

import { useSearchMovies } from '@/hooks/use-search-movies'
import { useFavorites } from '@/hooks/use-favorites'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

import { MovieSearchBar } from '@/components/movie-search-bar'
import { MoviesFavoritesTable } from '@/components/movies-favorites-table'
import { MoviesResultTable } from '@/components/movies-result-table'
import { RedirectModal } from '@/components/redirect-modal'
import { RemoveFavoriteModal } from '@/components/remove-favorite-modal'
import { Spinner } from '@/components/spinner'

import styles from './home.module.css'
import type { TMDBMovie } from '@/services/tmdb/types'
import { openIMDBPage } from '@/utils/open-imdb-page'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [movieToRemove, setMovieToRemove] = useState<TMDBMovie | null>(null)

  const { favorites, remove } = useFavorites()
  const { isLoading, isFetchingNextPage, results, fetchNextPage } =
    useSearchMovies(searchTerm)
  const loaderRef = useIntersectionObserver<HTMLTableRowElement>(
    fetchNextPage,
    { threshold: 0.4 }
  )

  function handleChange(term: string) {
    setSearchTerm(term)
  }

  async function handleSelect(movie: TMDBMovie) {
    setSearchTerm(movie.title)
    setIsRedirecting(true)

    await openIMDBPage(movie)

    setIsRedirecting(false)
  }

  function handleMovieRemove() {
    if (!movieToRemove) return

    remove(movieToRemove.id)
    setMovieToRemove(null)
  }

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
            <p className={styles.emptyFavorites}>
              Nenhum filme favoritado ainda.
            </p>
          ) : (
            <MoviesFavoritesTable
              movies={favorites}
              onRemove={(movie) => setMovieToRemove(movie)}
            />
          )}
        </section>
      )}

      <RedirectModal isOpen={isRedirecting} />

      {movieToRemove !== null ? (
        <RemoveFavoriteModal
          isOpen={!!movieToRemove}
          movieTitle={movieToRemove.title}
          onConfirm={handleMovieRemove}
          onClose={() => setMovieToRemove(null)}
        />
      ) : null}
    </main>
  )
}
