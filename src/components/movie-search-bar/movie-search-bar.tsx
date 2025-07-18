import { useState, useRef, type KeyboardEvent, type ChangeEvent } from 'react'
import { MovieSuggestionsList } from '../movies-suggestion-list'
import { NoResultsMessage } from '../no-results-message'
import { useClickOutside } from '@/hooks/use-click-outside'
import { useFavorites } from '@/hooks/use-favorites'
import { normalizeText } from '@/utils/normalize-text'
import { classnames } from '@/utils/classnames'
import styles from './movie-search-bar.module.css'
import type { TMDBMovie } from '@/services/tmdb/types'

type MovieSearchBarProps = {
  value: string
  suggestions: TMDBMovie[]
  isLoading?: boolean
  onChange: (value: string) => void
  onSelect: (movie: TMDBMovie) => void
  className?: string
  onLastItemVisible?: () => void
}

export function MovieSearchBar(props: Readonly<MovieSearchBarProps>) {
  const {
    value,
    suggestions,
    isLoading,
    onChange,
    onSelect,
    className,
    onLastItemVisible
  } = props

  const [previousValue, setPreviousValue] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const { toggle } = useFavorites()

  useClickOutside(wrapperRef, () => {
    setIsFocused(false)
    setHighlightedIndex(null)
  })

  const normalizedInput = normalizeText(value)

  const exactMatch = suggestions.find(
    (suggestion) => normalizeText(suggestion.title) === normalizedInput
  )
  const otherSuggestions = suggestions.filter(
    (suggestion) => suggestion.id !== exactMatch?.id
  )
  const allSuggestions = exactMatch
    ? [exactMatch, ...otherSuggestions]
    : otherSuggestions

  const normalizedSuggestion = normalizeText(allSuggestions[0]?.title || '')

  const hasSuggestions = !isLoading && allSuggestions?.length > 0
  const hasNoResults = !isLoading && !hasSuggestions && normalizedInput !== ''
  const hasMatchingSuggestion =
    normalizedSuggestion?.startsWith(normalizedInput)
  const hasSuggestionEqualsTheSearch = normalizedSuggestion === normalizedInput

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!allSuggestions.length) return

    const suggestion = allSuggestions[0]

    if (event.key === 'ArrowLeft') {
      if (normalizedSuggestion.startsWith(normalizedInput)) {
        event.preventDefault()
        onChange(previousValue)
      }
    }

    if (event.key === 'ArrowRight') {
      if (normalizedSuggestion.startsWith(normalizedInput)) {
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
        setIsFocused(false)
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
      setIsFocused(false)
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
    if (!isFocused) setIsFocused(true)
    onChange(event.target.value)
  }

  function handleFocus() {
    setIsFocused(true)
  }

  return (
    <div ref={wrapperRef} className={classnames(styles.wrapper, className)}>
      <label htmlFor="movie-search" className={styles.label}>
        Pesquise um filme
      </label>

      <div className={styles.inputWrapper}>
        {!hasSuggestionEqualsTheSearch && (
          <div className={styles.autocompleteOverlay}>
            <span className={styles.userInput}>{value}</span>

            {hasMatchingSuggestion ? (
              <span className={styles.suggestionSuffix}>
                {allSuggestions[0].title.slice(value.length)} - Utilize a tecla
                → para aceitar a sugestão
              </span>
            ) : null}
          </div>
        )}

        <input
          id="movie-search"
          className={styles.input}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Ex: Star Wars"
        />
      </div>

      <p className={styles.help}>
        Utilize as teclas ↓ ↑ para navegar entre as opções
      </p>

      {hasSuggestions && isFocused ? (
        <MovieSuggestionsList
          value={value}
          onSelect={onSelect}
          suggestions={allSuggestions}
          exactMatch={exactMatch}
          highlightedIndex={highlightedIndex}
          onLastItemVisible={onLastItemVisible}
        />
      ) : null}

      {hasNoResults ? <NoResultsMessage query={value} /> : null}
    </div>
  )
}
