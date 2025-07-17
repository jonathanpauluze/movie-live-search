import { useEffect, useRef } from 'react'
import { useFavorites } from '@/hooks/use-favorites'
import { highlightMatch } from '@/utils/highlight-match'
import { classnames } from '@/utils/classnames'
import { Icon } from '@/components/icon'
import { PosterImage } from '../poster-image'
import styles from './movie-suggestions-list.module.css'
import type { TMDBMovie } from '@/services/tmdb/types'

type MovieSuggestionsProps = {
  suggestions: TMDBMovie[]
  exactMatch: TMDBMovie | undefined
  value: string
  highlightedIndex: number | null
  onSelect: (movie: TMDBMovie) => void
}

export function MovieSuggestionsList(props: Readonly<MovieSuggestionsProps>) {
  const { suggestions, exactMatch, value, highlightedIndex, onSelect } = props

  const listRef = useRef<HTMLUListElement | null>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const { toggle, has } = useFavorites()
  function isFavorite(id: number) {
    return has(id)
  }

  useEffect(() => {
    const element =
      highlightedIndex !== null ? itemRefs.current[highlightedIndex] : null

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [highlightedIndex])

  return (
    <ul className={styles.dropdown} ref={listRef}>
      {suggestions.map((suggestion, index) => {
        const isExactMatch = suggestion.id === exactMatch?.id

        return (
          <li
            key={suggestion.id}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            onClick={() => onSelect(suggestion)}
            className={classnames({
              [styles.exactMatchItem]: isExactMatch,
              [styles.highlighted]: index === highlightedIndex
            })}
          >
            {isExactMatch ? (
              <div className={styles.exactMatchContent}>
                <PosterImage path={suggestion.poster} alt={suggestion.title} />

                <div className={styles.exactMatchContentInfo}>
                  <p title={suggestion.title} className={styles.title}>
                    <strong>{suggestion.title}</strong>

                    {suggestion.release_year ? (
                      <span>({suggestion.release_year})</span>
                    ) : null}
                  </p>

                  <div className={styles.genresWrapper}>
                    {suggestion.genres.map((genre) => (
                      <span key={genre} className={styles.genreTag}>
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p>{highlightMatch(suggestion.title, value)}</p>
            )}

            <button
              className={classnames(styles.favoriteButton, {
                [styles.favorited]: isFavorite(suggestion.id)
              })}
              onClick={(e) => {
                e.stopPropagation()
                toggle(suggestion)
              }}
              aria-label={
                isFavorite(suggestion.id)
                  ? 'Remover dos favoritos'
                  : 'Adicionar aos favoritos'
              }
            >
              <Icon
                name={isFavorite(suggestion.id) ? 'star-filled' : 'star'}
                className={classnames({
                  [styles.notFavorite]: !isFavorite(suggestion.id),
                  [styles.favorite]: isFavorite(suggestion.id)
                })}
              />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
