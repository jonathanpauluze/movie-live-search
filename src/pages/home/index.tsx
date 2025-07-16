import { useEffect, useState } from 'react'
import { MovieSearchBar } from '@/components/movie-search-bar'
import { RedirectModal } from '@/components/redirect-modal'
import { TMDBClient } from '@/services/tmdb/client'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useGenres } from '@/hooks/use-genres'
import { useFavorites } from '@/hooks/use-favorites'
import type { TMDBMovie } from '@/services/tmdb/types'
import { formatMovieResult } from '@/utils/format-movie-result'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<TMDBMovie[]>([])
  const [results, setResults] = useState<TMDBMovie[]>([])
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { favorites, remove } = useFavorites()
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

  async function handleSelect(movie: TMDBMovie) {
    setSearchTerm(movie.title)
    setSuggestions([])
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
  }

  return (
    <main style={{ padding: '2rem' }}>
      <MovieSearchBar
        value={searchTerm}
        suggestions={suggestions}
        onChange={setSearchTerm}
        onSelect={handleSelect}
      />

      {searchTerm ? (
        <section>
          {results.map((movie) => (
            <div key={movie.id}>
              <strong>{movie.title}</strong> ({movie.release_year})
            </div>
          ))}
        </section>
      ) : (
        <section>
          <h2>Meus Favoritos</h2>
          {favorites.length === 0 ? (
            <p>Nenhum filme favoritado ainda.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Título</th>
                  <th align="left">Ano</th>
                  <th align="left">Gêneros</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {favorites.map((movie) => (
                  <tr key={movie.id}>
                    <td>{movie.title}</td>
                    <td>{movie.release_year}</td>
                    <td>{movie.genres.join(', ')}</td>
                    <td>
                      <button
                        onClick={() => remove(movie.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'red',
                          cursor: 'pointer'
                        }}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      <RedirectModal isOpen={isRedirecting} />
    </main>
  )
}
