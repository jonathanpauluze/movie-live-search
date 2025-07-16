import {
  useRef,
  useState,
  useEffect,
  type KeyboardEvent,
  type ChangeEvent
} from 'react'
import type { TMDBMovie } from '@/services/tmdb/types'
import { highlightMatch } from '@/utils/highlight-match'
import { Icon } from '../icon'
import { classnames } from '@/utils/classnames'
import { useFavorites } from '@/hooks/use-favorites'
import styles from './movie-search-bar.module.css'

type MovieSearchBarProps = {
  value: string
  suggestions: TMDBMovie[]
  onChange: (value: string) => void
  onSelect: (movie: TMDBMovie) => void
}

export function MovieSearchBar({
  value,
  suggestions,
  onChange,
  onSelect
}: Readonly<MovieSearchBarProps>) {
  const [previousValue, setPreviousValue] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const { toggle, has } = useFavorites()

  const listRef = useRef<HTMLUListElement | null>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const parsedSuggestion = suggestions[0]?.title?.toLowerCase()
  const parsedSearchTerm = value.toLowerCase()
  const isSuggestionSameAsSearchTerm = parsedSuggestion === parsedSearchTerm

  const exactMatch = suggestions.find(
    (suggestion) => suggestion.title.toLowerCase() === value.toLowerCase()
  )
  const otherSuggestions = suggestions.filter(
    (suggestion) => suggestion.id !== exactMatch?.id
  )
  const allSuggestions = exactMatch
    ? [exactMatch, ...otherSuggestions]
    : otherSuggestions

  function isFavorite(id: number) {
    return has(id)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) return

    const suggestion = suggestions[0]

    if (event.key === 'ArrowLeft') {
      if (suggestion?.title.toLowerCase().startsWith(value.toLowerCase())) {
        event.preventDefault()
        onChange(previousValue)
      }
    }

    if (event.key === 'ArrowRight') {
      if (suggestion?.title.toLowerCase().startsWith(value.toLowerCase())) {
        event.preventDefault()
        setPreviousValue(value)
        onChange(suggestion.title)
      }
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()

      setIsNavigating(true)
      setHighlightedIndex((prev) => {
        if (prev === null) return 0

        return prev < suggestions.length - 1 ? prev + 1 : 0
      })
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()

      setIsNavigating(true)
      setHighlightedIndex((prev) => {
        if (prev === null) return 0

        return prev > 0 ? prev - 1 : suggestions.length - 1
      })
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const selected =
        highlightedIndex !== null ? suggestions[highlightedIndex] : null
      if (selected) {
        onSelect(selected)
      }
    }

    if (event.key === ' ') {
      const selected =
        highlightedIndex !== null ? suggestions[highlightedIndex] : null

      if (isNavigating && selected) {
        event.preventDefault()

        toggle(selected)
      }
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setHighlightedIndex(null)
      setIsNavigating(false)
    }

    if (
      ![
        'ArrowUp',
        'ArrowDown',
        ' ',
        'Enter',
        'Escape',
        'ArrowLeft',
        'ArrowRight'
      ].includes(event.key)
    ) {
      setIsNavigating(false)
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
  }

  useEffect(() => {
    const element =
      highlightedIndex !== null ? itemRefs.current[highlightedIndex] : null

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [highlightedIndex])

  return (
    <div className={styles.wrapper}>
      <label htmlFor="movie-search" className={styles.label}>
        Pesquise um filme
      </label>

      <div className={styles.inputWrapper}>
        {!isSuggestionSameAsSearchTerm && (
          <div className={styles.autocompleteOverlay}>
            <span className={styles.userInput}>{value}</span>
            {parsedSuggestion?.startsWith(parsedSearchTerm) && (
              <span className={styles.suggestionSuffix}>
                {suggestions[0].title.slice(value.length)} - Utilize a tecla →
                para aceitar a sugestão
              </span>
            )}
          </div>
        )}

        <input
          id="movie-search"
          className={styles.input}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ex: Star Wars"
        />
      </div>

      <p className={styles.help}>
        Utilize as teclas ↓ ↑ para navegar entre as opções
      </p>

      {suggestions?.length > 0 ? (
        <ul className={styles.dropdown} ref={listRef}>
          {allSuggestions.map((suggestion, index) => {
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
                    {suggestion.poster ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${suggestion.poster}`}
                        alt={suggestion.title}
                        className={styles.poster}
                      />
                    ) : (
                      <div className={styles.defaultPoster}>
                        <Icon name="movie" size="md" />
                      </div>
                    )}

                    <div className={styles.exactMatchContentInfo}>
                      <p title={suggestion.title} className={styles.title}>
                        <strong>{suggestion.title}</strong>
                        <span>({suggestion.release_year})</span>
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
      ) : null}
    </div>
  )
}
